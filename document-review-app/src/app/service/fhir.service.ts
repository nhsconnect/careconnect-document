import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseContentType} from "@angular/http";

@Injectable()
export class FhirService {


  private EDMSbase: string = 'http://localhost:8181/STU3';

  private TIEbase: string = 'http://localhost:8182/STU3';


  public path = '/Composition';

  getEDMSUrl(): string {
    return this.EDMSbase;
  }

  getTIEUrl(): string {
    return this.TIEbase;
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

    const url = this.getEDMSUrl() + this.path +`?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getCompositionDocument(id: string,): Observable<fhir.Bundle> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getCompositionDocumentHTML(id: string): Observable<any> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'text/html' });


    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(id: string): Observable<any> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/pdf' });

    return this.http
      .get(url, { headers, responseType : 'blob' as 'blob'} );
  }


  postEDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getEDMSUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' : this.getHeaders()});

  }


  getEPRSCRDocument(patientId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Patient/${patientId}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPREncounters(patientId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Encounter?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getEPRObservations(patientId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Observation?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getEPRMedicationRequests(patientId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/MedicationRequest?patient=${patientId}`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  getEPREncounter(encounterId: string): Observable<fhir.Bundle> {

    const url = this.getTIEUrl()  + `/Encounter/${encounterId}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }

  /* GET patients whose name contains search term */
  searchPatients(term: string, systemType : string): Observable<fhir.Bundle> {

    let url =  this.getEDMSUrl();
    if (systemType === 'EPR') {
      url =  this.getTIEUrl();
    }
    return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, { 'headers' : this.getHeaders() });
  }

}
