import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class FhirService {


  private base: string = 'http://localhost:8181/STU3';


  public path = '/Composition';

  getUrl(): string {
    return this.base;
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

}
