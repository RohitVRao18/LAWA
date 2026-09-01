// Define allowed env values
type Environment = 'qa' | 'staging' | 'prod';

//  Config object with strict typing
const configs: Record<Environment, string> = {
  qa: 'https://test.jobsatlax.org/',
  staging: 'https://test.jobsatlax.org/',
  prod: 'https://test.jobsatlax.org/'
};

// Narrow env safely
const env: Environment = (process.env.ENV as Environment) || 'qa';

export const ENV = {
  baseURL: configs[env],
  portalURL: 'https://test.jobsatlax.org/'
};