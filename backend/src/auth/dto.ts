import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  // Optional for backward compatibility with older mobile builds.
  // New builds should always send it.
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId?: string;
}

export class RefreshDto {
  @IsString()
  @MinLength(20)
  refreshToken!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId?: string;
}

export class LogoutDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId?: string;
}

export class MfaSetupDto {
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId!: string;
}

export class MfaVerifyDto {
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  deviceId!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(10)
  code!: string;
}
