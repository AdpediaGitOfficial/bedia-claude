/**
 * Create or reset a dashboard admin account.
 *
 * The dashboard logs in via POST /auth/login, which looks up
 * { email, isDeleted: false } in the `users` collection and bcrypt-compares the
 * password. If you restored the DB dump, the admin's original password is only
 * stored as a hash (unknown), so use this to set a known password.
 *
 * Usage (from the backend/ directory, with a valid .env DATABASE):
 *   npx ts-node scripts/setAdminPassword.ts admin@bediapottery.ae 'NewStrongPass123'
 * or:
 *   ADMIN_EMAIL=admin@bediapottery.ae ADMIN_PASSWORD='NewStrongPass123' \
 *     npx ts-node scripts/setAdminPassword.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import configKeys from '../configKeys';
import usersModel from '../auth/models/userModel';

async function main(): Promise<void> {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "Usage: npx ts-node scripts/setAdminPassword.ts <email> '<password>'\n" +
        '   or set ADMIN_EMAIL and ADMIN_PASSWORD env vars.',
    );
    process.exit(1);
  }
  if (!configKeys.DATABASE_URL) {
    console.error('DATABASE is not set in the environment (.env).');
    process.exit(1);
  }

  await mongoose.connect(configKeys.DATABASE_URL);

  const hash = await bcrypt.hash(password, 10);
  const user = await usersModel.findOneAndUpdate(
    { email },
    {
      $set: { password: hash, role: 'admin', isDeleted: false },
      $setOnInsert: { name: 'Admin' },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  console.log(`✅ Admin ready: ${user?.email} (role=${user?.role}). You can now log in with the new password.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Failed to set admin password:', err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
