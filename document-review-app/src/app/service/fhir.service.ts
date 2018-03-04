import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class FhirService {


  private EDMSbase: string = 'http://localhost:8181/STU3';

  //private TIEbase: string = 'http://localhost:8182/STU3';


  public path = '/Composition';

  getEDMSUrl(): string {
    return this.EDMSbase;
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

  getCompositionDocument(id: string): Observable<fhir.Bundle> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getCompositionDocumentHTML(id: string): Observable<fhir.Bundle> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'text/html' });
    return this.http.get<fhir.Bundle>(url,{ 'headers' : headers});
  }
  getCompositionDocumentPDF(id: string): Observable<fhir.Bundle> {

    const url = this.getEDMSUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/pdf' });
    return this.http.get<fhir.Bundle>(url,{ 'headers' : headers});
  }

  postEDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getEDMSUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' : this.getHeaders()});

  }

  /*
  getEPRSCRDocument(id: number): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Patient/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
*/

  /* GET patients whose name contains search term */
  searchPatients(term: string): Observable<fhir.Bundle> {

    return this.http.get<fhir.Bundle>(this.getEDMSUrl() + `/Patient?name=${term}`, { 'headers' : this.getHeaders() });
  }

}
