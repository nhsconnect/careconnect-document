import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Oauth2token} from "../model/oauth2token";
import {isNumber} from "util";
import {AuthService} from "./auth.service";
import {AngularFireDatabase} from "angularfire2/database";
import {Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";

@Injectable()
export class FhirService {


  // TODO https://www.intertech.com/Blog/angular-4-tutorial-handling-refresh-token-with-new-httpinterceptor/
  //

  private EPRbase: string = 'http://127.0.0.1:8080/careconnect-gateway-secure/STU3';
  //private EPRbase: string = 'https://purple.testlab.nhs.uk/smart-on-fhir-resource/STU3';

  private authoriseUri: string;

  private tokenUri: string;

  private registerUri: string;

  private smartToken : Oauth2token;

  oauthTokenChange : EventEmitter<Oauth2token> = new EventEmitter();

  public path = '/Composition';


  getEPRUrl(): string {
    return this.EPRbase;
  }

  constructor(  private http: HttpClient
                ,private authService: AuthService
                , public db : AngularFireDatabase
                , private router: Router
                , private platformLocation: PlatformLocation) { }

  getHeaders(contentType : boolean = true ): HttpHeaders {

    let headers = new HttpHeaders(
      );
    if (contentType) {
      headers = headers.append( 'Content-Type',  'application/fhir+json' );
      headers = headers.append('Accept', 'application/fhir+json');
    }
    return headers;
  }

  getEPRHeaders(contentType : boolean = true ): HttpHeaders {

    let headers = this.getHeaders(contentType);
    if (localStorage.getItem("access_token") != undefined) {

      headers = headers.append('Authorization' , 'bearer '+localStorage.getItem("access_token"));
    } else {
      console.log('Access Token missing!');
    }
    return headers;
  }

  authoriseOAuth2() : void  {
    console.log("getAuthoriseUrl()");
 //   if (this.authoriseUri !== undefined) return this.authoriseUri;

    this.http.get<fhir.CapabilityStatement>(this.getEPRUrl()+'/metadata').subscribe(
      conformance  => {
        console.log("getAuthoriseUrl() next: ");
        for (let rest of conformance.rest) {
          for (let extension of rest.security.extension) {
            //console.log("Security extensions");
            if (extension.url == "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris") {
             // console.log("smart extensions");
              for (let smartextension of extension.extension) {
                //console.log(smartextension.url);
                switch (smartextension.url) {
                  case "authorize" : {
                      this.authoriseUri = smartextension.valueUri;
                      break;
                  }
                  case "register" : {
                    this.registerUri = smartextension.valueUri;
                    break;
                  }
                  case "token" : {
                    this.tokenUri = smartextension.valueUri;
                    break;
                  }
                }

              }
            }
          }
        }

      },
      error1 => {},
      () => {
        // Check here for client id - need to store in database
        // If no registration then register client

        console.log((this.platformLocation as any).location.origin);

        let clients = this.db.database.ref('oauth2/'+encodeURI((this.platformLocation as any).location.origin)).once('value').then(
          (data) => {

            if (data.val() === null) {
              console.log('complete null');
              // Register client with OAuth2 server
              this.performRegister();
            } else {
              let auth= data.val();
              this.performAuthorise(auth.client_id, auth.client_secret);
            }
          },
          () => {
            console.log('rejected');

          }
        );
        console.log(clients);

        console.log('call perform Grant');
        //this.performGrant('ed73b2cb-abd0-4f75-b9a2-5f9c0535b82c','QOm0VcqJqa9stA1R0MJzHjCN_uYdo0PkY8OT68UCk2XDFxFrAUjajuqOvIom5dISjKshx2YiU51mXtx7W5UOwQ');
        return this.authoriseUri;
      }
    )
  }
  /*
  getToken() : void {
    console.log("getTokenUrl()");
    this.getOAuth2ServerUrls();
  }
  */


  getOAuthChangeEmitter() {
    return this.oauthTokenChange;
  }

  getScope() :string {
    return localStorage.getItem("scope");
  }
  hasScope(resource : string) : boolean {
    let scope : string= this.getScope();
    //console.log(scope + ' checking for '+resource);
    if (scope.indexOf(resource) !== -1) return true;
    return false;
  }


  performAuthorise (clientId : string, clientSecret :string){

    localStorage.setItem("clientId", clientId);
    localStorage.setItem("clientSecret", clientSecret);
    localStorage.setItem("authoriseUri", this.authoriseUri);
    localStorage.setItem("tokenUri", this.tokenUri);

    const url = this.authoriseUri + '?client_id=' + clientId+'&response_type=code&redirect_uri=http://localhost:4200/callback&aud=https://test.careconnect.nhs.uk';

    // Perform redirect to
    window.location.href = url;

  }


  performRegister() {
    const url = this.registerUri;

    let payload = JSON.stringify({ client_name : 'ClinicalAssuranceTool' ,
      redirect_uris : ["http://localhost:4200/callback"],
      client_uri : "http://localhost:4200",
      grant_types: ["authorization_code"],
      scope: "user/Patient.read user/DocumentReference.read user/Binary.read smart/orchestrate_launch"
    });

    let headers = new HttpHeaders( {'Content-Type': 'application/json '} );
    headers = headers.append('Accept','application/json');
    this.http.post(url,payload,{ 'headers' : headers }  ).subscribe( response => {
        console.log("Register Response = "+response);
        this.db.object('oauth2/'+encodeURI((this.platformLocation as any).location.origin)).set(response);
        this.performAuthorise((response as any).client_id, (response as any).client_secret);
      }
      , (error: any) => {
        console.log("Register Response Error = "+error);
      }
      ,() => {

        console.log("Register complete()")



      }
    );
  }
  performGetAccessToken(authCode :string ) {


    let bearerToken = 'Basic '+btoa(localStorage.getItem("clientId")+":"+localStorage.getItem("clientSecret"));
    let headers = new HttpHeaders( {'Authorization' : bearerToken});
    headers= headers.append('Content-Type','application/x-www-form-urlencoded');

    const url = localStorage.getItem("tokenUri");

    let body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', authCode);
    body.set('redirect_uri','http://localhost:4200/callback');


    this.http.post<Oauth2token>(url,body.toString(), { 'headers' : headers } ).subscribe( response => {
        console.log(response);
        this.smartToken = response;
        this.authService.auth = true;
        localStorage.setItem("access_token", this.smartToken.access_token);

        localStorage.setItem("scope", this.smartToken.scope);
      }
      , (error: any) => {
      console.log(error);
      }
      ,() => {
        // Emit event
        console.log("performGetAccessToken - Emit event");
        this.oauthTokenChange.emit(this.smartToken);

      }
    );
  }

  launchSMART(contextId : string, patientId : string) :Observable<any> {

    // https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/119734296/Registering+a+Launch+Context


    let bearerToken = 'Basic '+btoa(localStorage.getItem("clientId")+":"+localStorage.getItem("clientSecret"));

    const url = localStorage.getItem("tokenUri").replace('token', '') + 'Launch';
    let payload = JSON.stringify({launch_id: contextId, parameters: []});

    let headers = new HttpHeaders({'Authorization': bearerToken });
    headers= headers.append('Content-Type','application/json');

    console.log(payload);
    return this.http.post<any>(url,"{ launch_id : '"+contextId+"', parameters : { username : '"+this.authService.userDetails.displayName+"', patient : '"+patientId+"' }  }", {'headers': headers});
  }

  /*
  authoriseOAuth2()
  {
    console.log("authoriseOAuth2");

    this.getToken();
  }
*/




  getSearchCompositions(patientId : string) : Observable<fhir.Bundle> {

    const url = this.getEPRUrl() + this.path +`?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }


  getBinary(id: string): Observable<fhir.Binary> {

    const url = this.getEPRUrl() + `/Binary/${id}`;

    return this.http.get<fhir.Binary>(url,{ 'headers' : this.getEPRHeaders(true)});

  }
  getBinaryRaw(id: string,): Observable<any> {

    const url = this.getEPRUrl() + `/Binary/${id}`;

    return this.http.get(url,{ 'headers' : this.getEPRHeaders(false) , responseType : 'blob' });

  }


  getCompositionDocumentHTML(id: string): Observable<any> {

    const url = this.getEPRUrl() + `/Binary/${id}`;

    let headers = this.getEPRHeaders(false);
    headers = headers.append('Content-Type', 'text/html' );

    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(id: string): Observable<any> {

    const url = this.getEPRUrl() + `/Binary/${id}`;

    let headers = this.getEPRHeaders(false);
    headers = headers.append(
       'Content-Type', 'application/pdf' );

    return this.http
      .get(url, { headers, responseType : 'blob' as 'blob'} );
  }



  postBundle(document: any,contentType : string) : Observable<any> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    const url = this.getEPRUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' :headers});
  }

  postBundleValidate(document: any,contentType : string) : Observable<any> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    const url = this.getEPRUrl() + `/Bundle/$validate?_format=json`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' :headers});
  }

  putBundle(document: any,contentType : string) : Observable<any> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    // TODO Get real id from XML Bundle
    const url = this.getEPRUrl() + `/Bundle`;
    let params = new HttpParams();
    params = params.append('identifier','https://tools.ietf.org/html/rfc4122|1ff370b6-fc5b-40a1-9721-2a942e301f65');
    return this.http.put<fhir.Bundle>(url,document,{ 'params': params, 'headers' :headers});
  }

  getEPREncounters(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Encounter?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRConditions(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Condition?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRAllergies(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/AllergyIntolerance?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRDocuments(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/DocumentReference?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }


  getEPREncounter(encounterId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Encounter/${encounterId}/$document?_count=50`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }
  getEPREncounterInclude(encounterId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Encounter?_id=${encounterId}&_revinclude=*&_count=50`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRImmunisations(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Immunization?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRMedicationRequests(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/MedicationRequest?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRMedication(medicationId: string): Observable<fhir.Medication> {

    const url = this.getEPRUrl()  + `/Medication/${medicationId}`;

    return this.http.get<fhir.Medication>(url,{ 'headers' : this.getEPRHeaders()});

  }


  getEPRObservations(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Observation?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }


  getEPRObservationsByCode(id: number, code:string, date : string): Observable<fhir.Bundle> {

    let url = this.getEPRUrl()  + `/Observation?patient=${id}`+`&code=${code}&_count=20`;
    if (date != undefined) {
      url = url + '&date=ge' + date;
    }

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRPatient(patientId: string): Observable<fhir.Patient> {

    const url = this.getEPRUrl()  + `/Patient/${patientId}`;

    return this.http.get<fhir.Patient>(url,{ 'headers' : this.getEPRHeaders()});

  }
  getEPRProcedures(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Procedure?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }




  /* GET patients whose name contains search term */
  searchPatients(term: string): Observable<fhir.Bundle> {
    let url =  this.getEPRUrl();
    if (!isNaN(parseInt(term))) {
      console.log('Number '+term);
      url =  this.getEPRUrl();
      return this.http.get<fhir.Bundle>(url + `/Patient?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {

        url = this.getEPRUrl();
        return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, {'headers': this.getEPRHeaders()});

    }

  }

  searchOrganisations(term: string): Observable<fhir.Bundle> {
    let url =  this.getEPRUrl();

    url = this.getEPRUrl();
    return this.http.get<fhir.Bundle>(url + `/Organization?name=${term}`, {'headers': this.getEPRHeaders()});


  }

  searchPractitioners(term: string): Observable<fhir.Bundle> {
    let url =  this.getEPRUrl();
    if (!isNaN(parseInt(term))) {
      console.log('Number '+term);
      url =  this.getEPRUrl();
      return this.http.get<fhir.Bundle>(url + `/Practitioner?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {

        url = this.getEPRUrl();
        return this.http.get<fhir.Bundle>(url + `/Practitioner?address-postalcode=${term}`, {'headers': this.getEPRHeaders()});

    }

  }

}
