const withPWA = require('next-pwa');
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants');

module.exports = module.exports = (phase) => {
  // variables are only required at run time - not static build time
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_SERVER) {
    const requiredRuntimeVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL'];
    const missingVars = requiredRuntimeVars.filter((envVar) => !process.env[envVar]);
    if (missingVars.length > 0) {
      console.error('Missing environment variables.');
      console.error('Missing: ', missingVars.join(', '));
      console.error('Are you missing a .env.local file?');
      process.exit(1);
    }
  }

  return withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
      disable: phase === PHASE_DEVELOPMENT_SERVER,
    },
  });
};
