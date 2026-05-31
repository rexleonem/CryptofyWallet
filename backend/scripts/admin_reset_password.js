/**
 * Admin utility: reset a user's passwordHash by email.
 *
 * Usage (PowerShell):
 *   $env:EMAIL='user@example.com'
 *   $env:NEW_PASSWORD='StrongPass123!'
 *   node scripts/admin_reset_password.js
 */

require("dotenv").config();

const argon2 = require("argon2");
const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = (process.env.EMAIL || "").trim().toLowerCase();
  const newPassword = process.env.NEW_PASSWORD || "";

  if (!email) {
    throw new Error("EMAIL env var is required");
  }
  if (newPassword.length < 8) {
    throw new Error("NEW_PASSWORD must be at least 8 characters");
  }

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
    await prisma.user.update({ where: { email }, data: { passwordHash } });
  } finally {
    await prisma.$disconnect();
  }
}

main().then(
  () => {
    process.stdout.write("OK\n");
  },
  (err) => {
    process.stderr.write(String(err && err.message ? err.message : err) + "\n");
    process.exitCode = 1;
  },
);

