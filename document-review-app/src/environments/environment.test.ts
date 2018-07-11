// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  keycloak: {
    RootUrl: 'https://enterprisearchitecture-test.digital.nhs.uk/auth',
    authServerUrl: 'https://enterprisearchitecture-test.digital.nhs.uk/auth',
    realm : 'ReferenceImplementations',
    client_secret : 'KEYCLOAK_CLIENT_SECRET',
    client_id : 'ccri-cat'
  },
  login : '',
  oauth2 : {
    eprUrl : 'https://purple.testlab.nhs.uk/smart-on-fhir-resource/STU3',
    client_id : 'clinical-assurance-tool',
    client_secret : 'SMART_OAUTH2_CLIENT_SECRET',
    cookie_domain: 'purple.testlab.nhs.uk'
  },
  smart: {
    cardiac : 'https://purple.testlab.nhs.uk/cardiac/launch.html?iss=https://purple.testlab.nhs.uk/smart-on-fhir-resource/STU3&launch=',
    growthChart : 'https://purple.testlab.nhs.uk/gc/launch.html?iss=https://purple.testlab.nhs.uk/smart-on-fhir-resource/STU3&launch='
  }
};
