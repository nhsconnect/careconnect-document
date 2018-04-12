import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseContentType} from "@angular/http";

@Injectable()
export class FhirService {


  private FDMSbase: string = 'http://localhost:8181/STU3';

  private TIEbase: string = 'http://localhost:8182/STU3';

  private EPRbase: string = 'http://purple.testlab.nhs.uk/careconnect-ri/STU3';

  public path = '/Composition';

  getFDMSUrl(): string {
    return this.FDMSbase;
  }


  getTIEUrl(): string {
    return this.TIEbase;
  }


  getEPRUrl(): string {
    return this.EPRbase;
  }

  constructor(  private http: HttpClient ) { }

  getHeaders(): HttpHeaders {

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/json' });
    headers.append('Accept' , 'application/json' );
    headers.append('Cache-control', 'no-cache');
    headers.append('Cache-control', 'no-store');
    headers.append('Expires', '0');
    headers.append('Pragma', 'no-cache');
    return headers;
  }

  getSearchCompositions(patientId : string) : Observable<fhir.Bundle> {

    const url = this.getFDMSUrl() + this.path +`?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getCompositionDocument(id: string,): Observable<fhir.Bundle> {

    const url = this.getFDMSUrl() + this.path +`/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getCompositionDocumentHTML(id: string): Observable<any> {

    const url = this.getFDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'text/html' });


    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(id: string): Observable<any> {

    const url = this.getFDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/pdf' });

    return this.http
      .get(url, { headers, responseType : 'blob' as 'blob'} );
  }


  postFDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getFDMSUrl() + `/Bundle`;

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

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRConditions(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Condition?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRAllergies(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/AllergyIntolerance?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRDocuments(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/DocumentReference?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRPatient(patientId: string): Observable<fhir.Patient> {

    const url = this.getEPRUrl()  + `/Patient/${patientId}`;

    return this.http.get<fhir.Patient>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRObservations(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Observation?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRProcedures(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Procedure?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPRMedicationRequests(patientId: string): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/MedicationRequest?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPREncounter(encounterId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Encounter/${encounterId}/$document?_count=50`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  /* GET patients whose name contains search term */
  searchPatients(term: string, systemType : string): Observable<fhir.Bundle> {

    let url =  this.getFDMSUrl();
    if (systemType === 'EPR') {
      url =  this.getEPRUrl();
    }
    return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, { 'headers' : this.getHeaders() });
  }

}
