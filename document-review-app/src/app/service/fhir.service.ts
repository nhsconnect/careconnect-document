import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseContentType} from "@angular/http";
import {Oauth2token} from "../model/oauth2token";

@Injectable()
export class FhirService {


  //private EPRbase: string = 'http://127.0.0.1:8080/careconnect-gateway/STU3';
  private EPRbase: string = 'https://purple.testlab.nhs.uk/careconnect-ri/STU3';

  private authoriseUrl: string = 'https://purple.testlab.nhs.uk/careconnect-ri/oauth2/token?grant_type=client_credentials&client_id=';

  public path = '/Composition';

  getEPRUrl(): string {
    return this.EPRbase;
  }

  constructor(  private http: HttpClient ) { }

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

  authorise(clientId : string, clientSecret :string) :Observable<Oauth2token>  {
    const url = this.authoriseUrl + clientId;

    var bearerToken = 'Basic '+btoa(clientId+":"+clientSecret);
    //  this.messageService.add('FhirService: OAuth2 '+url+' Authorization='+bearerToken);
    let headers = new HttpHeaders( {'Authorization' : bearerToken});
    //headers = headers.append('Content-Type' , 'application/json' );
    //headers = headers.append('Accept' , 'application/json' );
    console.log(headers);
    return this.http.post<Oauth2token>(url,'', { 'headers' : headers } );

  }


  getSearchCompositions(patientId : string) : Observable<fhir.Bundle> {

    const url = this.getEPRUrl() + this.path +`?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  /*
  getCompositionDocument(id: string,): Observable<fhir.Bundle> {

    const url = this.getEPRUrl() + this.path +`/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  */
  getBinary(id: string,): Observable<fhir.Bundle> {

    const url = this.getEPRUrl() + `/Binary/${id}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders(false)});

  }

  getCompositionDocumentHTML(id: string): Observable<any> {

    const url = this.getEPRUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'text/html' });


    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(id: string): Observable<any> {

    const url = this.getEPRUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/pdf' });

    return this.http
      .get(url, { headers, responseType : 'blob' as 'blob'} );
  }


  postFDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getEPRUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' : this.getHeaders()});

  }

/*
  getEPRSCRDocument(patientId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Patient/${patientId}/$document?_count=50`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
*/

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

  getEPRPatient(patientId: string): Observable<fhir.Patient> {

    const url = this.getEPRUrl()  + `/Patient/${patientId}`;

    return this.http.get<fhir.Patient>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRObservations(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Observation?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRProcedures(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Procedure?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPRMedicationRequests(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/MedicationRequest?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  getEPREncounter(encounterId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Encounter/${encounterId}/$document?_count=50`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getEPRHeaders()});

  }

  /* GET patients whose name contains search term */
  searchPatients(term: string, systemType : string): Observable<fhir.Bundle> {

    let url =  this.getEPRUrl();
    if (systemType === 'EPR') {
      url =  this.getEPRUrl();
      return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {
      return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, { 'headers' : this.getHeaders() });
    }

  }

}
