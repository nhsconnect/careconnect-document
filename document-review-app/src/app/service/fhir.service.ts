import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Oauth2token} from "../model/oauth2token";
import {isNumber} from "util";

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

    let bearerToken = 'Basic '+btoa(clientId+":"+clientSecret);
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


  postFDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getEPRUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' : this.getHeaders()});

  }

  postBundle(document: any,contentType : string) : Observable<any> {

    let headers :HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type',contentType);
    const url = this.getEPRUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' :headers});
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
  searchPatients(term: string, systemType : string): Observable<fhir.Bundle> {
    let url =  this.getEPRUrl();
    if (!isNaN(parseInt(term))) {
      console.log('Number '+term);
      url =  this.getEPRUrl();
      return this.http.get<fhir.Bundle>(url + `/Patient?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {
      if (systemType === 'EPR') {
        url = this.getEPRUrl();
        return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, {'headers': this.getEPRHeaders()});
      } else {
        return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, {'headers': this.getHeaders()});
      }
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
