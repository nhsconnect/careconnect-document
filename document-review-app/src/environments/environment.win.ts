// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  keycloak : {
    RootUrl: 'http://localhost:8080/auth',
    authServerUrl: 'http://localhost:8080/auth',
    realm : 'ReferenceImplementations',
    client_secret : 'e6f380d2-8e05-4807-9c63-56d92a40c894',
    client_id : 'ccri-cat'
  },
  login : '',
  oauth2 : {
    eprUrl : 'http://127.0.0.1:9090/careconnect-gateway-secure/STU3',
    client_id : 'clinical-assurance-tool',
    client_secret : 'AM3ai-PGoZZRW-7osWbzvGlDBHjHq7M2aBlpNttreHeEyB5jequWy8fsHMVQP4JV0Kd0Fzrtu0iNEqGqguq69Qs',
    cookie_domain : 'localhost'
  },
  smart: {
    cardiac : 'http://127.0.0.1:8000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=',
    growthChart : 'http://127.0.0.1:9000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch='
  }
};
