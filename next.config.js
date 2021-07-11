if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.NEXTAUTH_URL ||
  !process.env.DATABASE_URL
) {
  console.error('Missing environment variables.');
  console.error('Required: GOOGLE_CLIENT_ID,  GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, DATABASE_URL');
  console.error('Are you missing a .env.local file?');
  process.exit(1);
}

module.exports = {
  reactStrictMode: true,
};
