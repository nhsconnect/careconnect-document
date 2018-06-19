export const environment = {
  production: true,
  keycloakRootUrl: 'http://localhost:8080/auth',
  firebase: {
    apiKey: "AIzaSyDOZAaiv8VP7i4IfViF_u5fEhgL1sjGSCQ",
    authDomain: "ccri-f0694.firebaseapp.com",
    databaseURL: "https://ccri-f0694.firebaseio.com",
    projectId: "ccri-f0694",
    storageBucket: "ccri-f0694.appspot.com",
    messagingSenderId: "1022563482363"
  },
  smart: {
    cardiac : 'http://127.0.0.1:8000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=',
    growthChart : 'http://127.0.0.1:9000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch='
  }
};
