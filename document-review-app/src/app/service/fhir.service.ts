import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class FhirService {


  private base: string = 'http://localhost:8181/STU3';

  private TIEbase: string = 'http://localhost:8182/STU3';


  public path = '/Composition';

  getUrl(): string {
    return this.base;
  }

  getEPRUrl(): string {
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

  getCompositionDocument(id: string): Observable<fhir.Bundle> {

    const url = this.getUrl() + this.path +`/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }
  getCompositionDocumentHTML(id: string): Observable<fhir.Bundle> {

    const url = this.getUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'text/html' });
    return this.http.get<fhir.Bundle>(url,{ 'headers' : headers});
  }
  getCompositionDocumentPDF(id: string): Observable<fhir.Bundle> {

    const url = this.getUrl() + this.path +`/${id}/$document`;

    let headers = new HttpHeaders(
      { 'Content-Type' : 'application/pdf' });
    return this.http.get<fhir.Bundle>(url,{ 'headers' : headers});
  }

  postEDMSDocument(document: fhir.Bundle) : Observable<any> {

    const url = this.getUrl() + `/Bundle`;

    return this.http.post<fhir.Bundle>(url,document,{ 'headers' : this.getHeaders()});

  }

  getEPRSCRDocument(id: number): Observable<fhir.Bundle> {

    const url = this.getEPRUrl()  + `/Patient/${id}/$document`;

    return this.http.get<fhir.Bundle>(url,{ 'headers' : this.getHeaders()});

  }


  /* GET patients whose name contains search term */
  searchPatients(term: string): Observable<fhir.Bundle> {

    return this.http.get<fhir.Bundle>(this.getEPRUrl() + `/Patient?name=${term}`, { 'headers' : this.getHeaders() });
  }

}
