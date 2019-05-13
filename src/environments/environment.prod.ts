// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  walletUrl: 'https://walleteos.com',
  votingUrl: 'https://eosportal.io',
  appName: 'GOC Tracker',
  logoUrl: '/assets/logo.png',
  blockchainUrl: 'http://api.goclab.io:8080',
  chainId: '1cf6b75731df97242f6a5bc2f2adcefacc279ff72986c3352cb51a2f9e2df3ef'
};
