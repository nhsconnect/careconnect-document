import {EventEmitter, Injectable, Output} from '@angular/core';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Oauth2token} from "../model/oauth2token";

import {AuthService} from "./auth.service";

import {Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";
import {environment} from "../../environments/environment";
import {Oauth2Service} from "./oauth2.service";

@Injectable()
export class FhirService {


  // TODO https://www.intertech.com/Blog/angular-4-tutorial-handling-refresh-token-with-new-httpinterceptor/
  //

  private authoriseUri: string;

  private tokenUri: string;

  private registerUri: string;

  private smartToken : Oauth2token;

  oauthTokenChange : EventEmitter<Oauth2token> = new EventEmitter();

  public path = '/Composition';


  public getEPRUrl(): string {

    let eprUrl :string = 'FHIR_SERVER_URL';
    if (eprUrl.indexOf('FHIR_SERVER') != -1) eprUrl = environment.oauth2.eprUrl;
    return eprUrl;
  }

  constructor(  private http: HttpClient
                ,private authService: AuthService
                , private router: Router
                , private platformLocation: PlatformLocation
                , private oauth2service : Oauth2Service
                ) { }

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

    return headers;
  }

  authoriseOAuth2() : void  {

    console.log('authoriseOAuth2');
    this.http.get<fhir.CapabilityStatement>(this.getEPRUrl()+'/metadata').subscribe(
      conformance  => {

        console.log('conformance response');

        for (let rest of conformance.rest) {
          for (let extension of rest.security.extension) {

            if (extension.url == "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris") {

              for (let smartextension of extension.extension) {

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
        // Dynamic registration not present at the mo but   this.performRegister();
        console.log('call performAuthorise');
        this.performAuthorise(environment.oauth2.client_id, this.getCatClientSecret());

        return this.authoriseUri;
      }
    )
  }

  getOAuthChangeEmitter() {
    return this.oauthTokenChange;
  }

  getScope() :string {
    return localStorage.getItem("scope");
  }
  hasScope(resource : string) : boolean {
    let scope : string= this.getScope();

    if (scope.indexOf(resource) !== -1) return true;
    return false;
  }


  performAuthorise (clientId : string, clientSecret :string){


    localStorage.setItem("authoriseUri", this.authoriseUri);
    localStorage.setItem("tokenUri", this.tokenUri);
    localStorage.setItem("registerUri", this.registerUri);

    if (this.oauth2service.getToken() !== undefined) {
      // access token is present so forgo access token retrieval

      this.authService.updateUser();
      // Check token expiry
      if (!this.oauth2service.isAuthenticated()) {
        const url = this.authoriseUri + '?client_id=' + clientId + '&response_type=code&redirect_uri='+document.baseURI+'/callback&aud=https://test.careconnect.nhs.uk';
        // Perform redirect to
        window.location.href = url;
      }
      // if token is ok perform a PING (if above code is working we may remove this)
      this.router.navigateByUrl('ping');
    } else {

      const url = this.authoriseUri + '?client_id=' + clientId + '&response_type=code&redirect_uri='+document.baseURI+'/callback&aud=https://test.careconnect.nhs.uk';
      // Perform redirect to
      window.location.href = url;
    }

  }


  performRegister() {
    if (this.registerUri === undefined) {
      this.registerUri = localStorage.getItem("registerUri");
    }
    const url = this.registerUri;

    let payload = JSON.stringify({ client_name : 'ClinicalAssuranceTool' ,
      redirect_uris : [document.baseURI+"/callback"],
      client_uri : document.baseURI,
      grant_types: ["authorization_code"],
      scope: "user/Patient.read user/DocumentReference.read user/*.read user/Binary.read user/Bundle.write smart/orchestrate_launch"
    });

    let headers = new HttpHeaders( {'Content-Type': 'application/json '} );
    headers = headers.append('Accept','application/json');
    this.http.post(url,payload,{ 'headers' : headers }  ).subscribe( response => {

       // KGM firebase code this.db.object('oauth2/'+encodeURI((this.platformLocation as any).location.origin)).set(response);
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

  getCatClientSecret() {
    // This is a marker for entryPoint.sh to replace
    let secret :string = 'SMART_OAUTH2_CLIENT_SECRET';
    if (secret.indexOf('SECRET') != -1) secret = environment.oauth2.client_secret;
    return secret;
  }


  performGetAccessToken(authCode :string ) {


    let bearerToken = 'Basic '+btoa(environment.oauth2.client_id+":"+this.getCatClientSecret());
    let headers = new HttpHeaders( {'Authorization' : bearerToken});
    headers= headers.append('Content-Type','application/x-www-form-urlencoded');

    const url = localStorage.getItem("tokenUri");

    let body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', authCode);
    body.set('redirect_uri',document.baseURI+'/callback');


    this.http.post<Oauth2token>(url,body.toString(), { 'headers' : headers } ).subscribe( response => {
       // console.log(response);
        this.smartToken = response;
        console.log('OAuth2Token : '+response);
        this.authService.auth = true;
        this.oauth2service.setToken( this.smartToken.access_token);

        this.oauth2service.setScope(this.smartToken.scope);

        this.authService.updateUser();
      }
      , (error: any) => {
      console.log(error);
      }
      ,() => {
        // Emit event

        this.oauthTokenChange.emit(this.smartToken);

      }
    );
  }

  launchSMART(appId : string, contextId : string, patientId : string) :Observable<any> {

    // Calls OAuth2 Server to register launch context for SMART App.

    // https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/119734296/Registering+a+Launch+Context

    let bearerToken = 'Basic '+btoa(environment.oauth2.client_id+":"+this.getCatClientSecret());

    const url = localStorage.getItem("tokenUri").replace('token', '') + 'Launch';
    let payload = JSON.stringify({launch_id: contextId, parameters: []});

    let headers = new HttpHeaders({'Authorization': bearerToken });
    headers= headers.append('Content-Type','application/json');

    console.log(payload);
    return this.http.post<any>(url,"{ launch_id : '"+contextId+"', parameters : { username : 'Get Details From Keycloak', patient : '"+patientId+"' }  }", {'headers': headers});
  }

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



  postBundle(document: any,contentType : string) : Observable<fhir.Bundle> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    headers.append('Prefer','return=representation');
    const url = this.getEPRUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' :headers});
  }

  postBundleValidate(document: any,contentType : string) : Observable<any> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    const url = this.getEPRUrl() + `/Bundle/$validate?_format=json`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' :headers});
  }

  putBundle(document: any,contentType : string) : Observable<fhir.Bundle> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    headers.append('Prefer','return=representation');

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

  getResource(reference : string ) : Observable<fhir.Resource> {
    const url = this.getEPRUrl()  + '/' + reference;

    return this.http.get<fhir.Resource>(url,{ 'headers' : this.getEPRHeaders()});
  }

  getEPRAllergies(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/AllergyIntolerance?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRDocuments(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/DocumentReference?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getDocumentReference(documentId: string): Observable<fhir.DocumentReference> {

    const url = this.getEPRUrl()  + `/DocumentReference/${documentId}`;

    return this.http.get<fhir.DocumentReference>(url,{ 'headers' : this.getEPRHeaders()});

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

  getEPRMedicationStatements(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/MedicationStatement?patient=${patientId}`;

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



  getEPRObservationsByCode(patientId: number, code:string, date : string): Observable<fhir.Bundle> {

    let url = this.getEPRUrl()  + `/Observation?patient=${patientId}`+`&code=${code}&_count=20`;
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

  getValueSet(valueSet : string ) : Observable<fhir.ValueSet> {
    const url = 'https://vonk.fire.ly/ValueSet/'+valueSet;
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/fhir+json');

    return this.http.get<fhir.ValueSet>(url,{ 'headers' : headers });
  }

  getNHSDValueSet(valueSet : string ) : Observable<fhir.ValueSet> {
    const url = 'https://fhir-test.nhs.uk/STU3/ValueSet/'+valueSet;
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/fhir+json');

    return this.http.get<fhir.ValueSet>(url,{ 'headers' : headers });
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

  searchPractitionerRoleByPractitioner(practitioner: string): Observable<fhir.Bundle> {
    let url =  this.getEPRUrl();

      url =  this.getEPRUrl();
      return this.http.get<fhir.Bundle>(url + `/PractitionerRole?practitioner=${practitioner}`, { 'headers' : this.getEPRHeaders() });

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
