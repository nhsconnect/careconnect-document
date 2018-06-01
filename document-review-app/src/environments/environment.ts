// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  keycloak: {
    RootUrl: 'http://localhost:8080/auth',
    authServerUrl: 'http://localhost:8080/auth',
    realm : 'fhir',
    client_id : 'ccri'
  },
  cat : {
    eprUrl : 'http://127.0.0.1:9090/careconnect-gateway-secure/STU3',
    client_id : '0b1c2961-d759-4fe2-8f24-a87437902c2a',
    client_secret : 'AM3ai-PGoZZRW-7osWbzvGlDBHjHq7M2aBlpNttreHeEyB5jequWy8fsHMVQP4JV0Kd0Fzrtu0iNEqGqguq69Qs'
  },
  catWin : {
    eprUrl : 'http://127.0.0.1:9090/careconnect-gateway-secure/STU3',
    client_id : '8b7fb34f-756d-4431-b75c-58bb2a0b41c1',
    client_secret : 'AKB3iOSv-UnAZUF1oOpRKLqWWeVzEf_YTLqyNrIrUPxB0DOgVrXRgJouYbi_rN3jKSDLXsJxnVVqtQqLAC2wlg'
  },
  firebase: {
    apiKey: "AIzaSyDOZAaiv8VP7i4IfViF_u5fEhgL1sjGSCQ",
    authDomain: "ccri-f0694.firebaseapp.com",
    databaseURL: "https://ccri-f0694.firebaseio.com",
    projectId: "ccri-f0694",
    storageBucket: "ccri-f0694.appspot.com",
    messagingSenderId: "1022563482363"
  }
};
