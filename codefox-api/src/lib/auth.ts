import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '../config/prisma';
import config from '../config';

export const auth = betterAuth({
  // Explicit — better-auth's env-based detection warns when it can't resolve
  // BETTER_AUTH_URL at init time.
  baseURL: config.betterAuth.url,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    // 'https://codefox-frontend-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ],

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ['repo'],
    },
  },
  
});
