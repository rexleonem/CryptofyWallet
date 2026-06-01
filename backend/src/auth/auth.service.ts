import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';
import { decryptWithMasterKey, encryptWithMasterKey, randomTokenBase64url, sha256Base64url } from '../common/crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private async issueTokens(user: { id: string; email: string; role: string }, sessionId: string) {
    const access = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId,
    });

    const refreshToken = randomTokenBase64url(48);
    const refreshSha = sha256Base64url(refreshToken);
    return { accessToken: access, refreshToken, refreshSha };
  }

  private async ensurePrimaryWallet(userId: string) {
    const existing = await this.prisma.wallet.findMany({ where: { userId } });
    if (existing.length > 0) return existing;

    try {
      const wallet = ethers.Wallet.createRandom();
      const keyPayload = encryptWithMasterKey(wallet.privateKey, 1);
      await this.prisma.wallet.create({
        data: {
          userId,
          address: wallet.address,
          label: 'Primary Wallet',
          network: 'ethereum',
          custodyProvider: 'LOCAL_VAULT',
          keyVersion: 1,
          encryptedPrivateKey: JSON.stringify(keyPayload),
        },
      });
      await this.prisma.portfolio.create({
        data: {
          name: 'Main Portfolio',
          walletId: wallet.address,
          assets: [],
        },
      });
    } catch {
      throw new ServiceUnavailableException('Authentication service unavailable (wallet provisioning failed)');
    }

    return this.prisma.wallet.findMany({ where: { userId } });
  }

  async signUp(input: { email: string; password: string; name?: string; deviceId: string; ip?: string; userAgent?: string }) {
    const email = this.normalizeEmail(input.email);
    const password = input.password || '';
    const name = input.name?.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('A valid email address is required.');
    if (password.length < 8) throw new BadRequestException('Password must be at least 8 characters.');

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Account already exists.');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    let user: any;
    try {
      user = await this.prisma.user.create({
        data: { email, name, passwordHash },
      });
    } catch (e: any) {
      // Common production misconfig: DB migrations not applied.
      throw new ServiceUnavailableException('Authentication service unavailable (database not ready)');
    }

    // Create a default custodial wallet record (encrypted at rest via VAULT_MASTER_KEY_B64).
    try {
      const wallet = ethers.Wallet.createRandom();
      const keyPayload = encryptWithMasterKey(wallet.privateKey, 1);
      await this.prisma.wallet.create({
        data: {
          userId: user.id,
          address: wallet.address,
          label: 'Primary Wallet',
          network: 'ethereum',
          custodyProvider: 'LOCAL_VAULT',
          keyVersion: 1,
          encryptedPrivateKey: JSON.stringify(keyPayload),
        },
      });
      // Create an empty portfolio container for user-managed positions.
      await this.prisma.portfolio.create({
        data: {
          name: 'Main Portfolio',
          walletId: wallet.address,
          assets: [],
        },
      });
    } catch (e: any) {
      // Distinguish vault misconfig from DB/model issues (migrations, constraints, etc).
      // We log server-side for diagnostics but return a safe message to clients.
      // eslint-disable-next-line no-console
      console.error('wallet_provisioning_failed', e?.message || e, e?.code || '');
      const msg = String(e?.message || '');
      if (msg.includes('VAULT_MASTER_KEY_B64')) {
        throw new ServiceUnavailableException('Authentication service unavailable (vault not configured)');
      }
      throw new ServiceUnavailableException('Authentication service unavailable (wallet provisioning failed)');
    }
    const wallets = await this.prisma.wallet.findMany({ where: { userId: user.id } });

    const { accessToken, refreshToken, refreshSha } = await this.issueTokens({ id: user.id, email: user.email!, role: user.role }, 'pending');
    let session: any;
    try {
      session = await this.prisma.session.create({
        data: {
          userId: user.id,
          deviceId: input.deviceId,
          refreshTokenSha: refreshSha,
          ip: input.ip,
          userAgent: input.userAgent,
        },
      });
    } catch {
      throw new ServiceUnavailableException('Authentication service unavailable (sessions not ready)');
    }
    const accessTokenFinal = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: session.id,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, mfaEnabled: user.mfaEnabled, wallets },
      accessToken: accessTokenFinal,
      refreshToken,
    };
  }

  async login(input: { email: string; password: string; deviceId: string; ip?: string; userAgent?: string }) {
    const email = this.normalizeEmail(input.email);
    const password = input.password || '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('A valid email address is required.');
    if (password.length < 8) throw new BadRequestException('Password must be at least 8 characters.');

    const user = await this.prisma.user.findUnique({ where: { email }, include: { wallets: true } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const wallets = user.wallets?.length ? user.wallets : await this.ensurePrimaryWallet(user.id);

    const { accessToken, refreshToken, refreshSha } = await this.issueTokens({ id: user.id, email: user.email!, role: user.role }, 'pending');
    let session: any;
    try {
      session = await this.prisma.session.create({
        data: {
          userId: user.id,
          deviceId: input.deviceId,
          refreshTokenSha: refreshSha,
          ip: input.ip,
          userAgent: input.userAgent,
        },
      });
    } catch {
      throw new ServiceUnavailableException('Authentication service unavailable (sessions not ready)');
    }

    const accessTokenFinal = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: session.id,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, mfaEnabled: user.mfaEnabled, wallets },
      accessToken: accessTokenFinal,
      refreshToken,
    };
  }

  async refresh(input: { refreshToken: string; deviceId: string; ip?: string; userAgent?: string }) {
    const refreshSha = sha256Base64url(input.refreshToken);
    const session = await this.prisma.session.findUnique({ where: { refreshTokenSha: refreshSha } });
    if (!session || session.revokedAt) throw new UnauthorizedException('Invalid session.');
    if (session.deviceId !== input.deviceId) throw new UnauthorizedException('Invalid session.');

    const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !user.email) throw new UnauthorizedException('Invalid session.');

    const { refreshToken, refreshSha: newSha } = await this.issueTokens({ id: user.id, email: user.email, role: user.role }, session.id);
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenSha: newSha, lastUsedAt: new Date(), ip: input.ip, userAgent: input.userAgent },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: session.id,
    });

    return { accessToken, refreshToken };
  }

  async logout(input: { userId: string; deviceId: string }) {
    const sessions = await this.prisma.session.findMany({
      where: { userId: input.userId, deviceId: input.deviceId, revokedAt: null },
    });
    await Promise.all(sessions.map((s) => this.prisma.session.update({ where: { id: s.id }, data: { revokedAt: new Date() } })));
    return { ok: true };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { wallets: true } });
    if (!user) return null;
    if (!user.wallets || user.wallets.length === 0) {
      const wallets = await this.ensurePrimaryWallet(user.id);
      return { ...user, wallets };
    }
    return user;
  }

  async mfaSetup(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) throw new UnauthorizedException();
    if (user.mfaEnabled) throw new BadRequestException('MFA already enabled.');

    const secret = authenticator.generateSecret();
    const payload = encryptWithMasterKey(secret, 1);
    const otpauth = authenticator.keyuri(user.email, 'Cryptofy', secret);

    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecretEnc: JSON.stringify(payload) },
    });

    return { otpauth };
  }

  async mfaVerifyEnable(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecretEnc) throw new BadRequestException('MFA not initialized.');

    const payload = JSON.parse(user.mfaSecretEnc);
    const secret = decryptWithMasterKey(payload);
    const ok = authenticator.check(code, secret);
    if (!ok) throw new ForbiddenException('Invalid MFA code.');

    await this.prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
    return { ok: true };
  }
}
