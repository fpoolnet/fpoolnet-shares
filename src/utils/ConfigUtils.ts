export const throwErrorIfEnvVarsNotFound = () => {
  if (!process.env.NEXT_PUBLIC_RELAY_URL) {
    throw new Error('NEXT_PUBLIC_RELAY_URL not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_EXPLORER_URL) {
    throw new Error('NEXT_PUBLIC_EXPLORER_URL not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_PAYOUTS_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_PAYOUTS_PUBLIC_KEY not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_SHARES_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_SHARES_PUBLIC_KEY not set in environment variables');
  }
};
