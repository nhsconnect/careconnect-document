// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keycloak: {
    RootUrl: 'http://localhost:8080/auth',
    authServerUrl: 'http://localhost:8080/auth',
    realm : 'ReferenceImplementations',
    client_secret : '8d9bad99-5478-49d7-936b-3724af6b3f72',
    client_id : 'smart-ehr'
  },
  keycloakWin : {
    RootUrl: 'http://localhost:8080/auth',
    authServerUrl: 'http://localhost:8080/auth',
    realm : 'ReferenceImplementations',
    client_secret : 'cb97e2d6-73d0-4bb2-b98b-8d48ba3935aa',
    client_id : 'smart-ehr'
  },
  cat : {
    eprUrl : 'http://127.0.0.1:9090/careconnect-gateway-secure/STU3',
    client_id : 'nhs-smart-ehr',
    client_secret : 'APa5oCe6SHhty_or2q34WpNcq0-X957n6p48TkAJw14YCtmZeQil60XvCfuByIPd8DlXyusxAGxp5_Z5UKlgZJU',
    cookie_domain : 'localhost'
  },
  smart: {
    cardiac : 'http://127.0.0.1:8000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=',
    growthChart : 'http://127.0.0.1:9000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch='
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
