/// <reference path="../../../../node_modules/@types/fhir/index.d.ts" />

import {Component, Input, OnInit} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/never';

import {
  catchError,
  debounceTime, distinctUntilChanged, map, switchMap
} from 'rxjs/operators';


import {HttpErrorResponse} from '@angular/common/http';
import {FhirService} from "../../service/fhir.service";
import { Router} from "@angular/router";


@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: [ './patient-search.component.css' ]
})
export class PatientSearchComponent implements OnInit {

  @Input() systemType : string;


  patients$: Observable<fhir.Patient[]>;
  private searchTerms = new Subject<string>();

  constructor(private fhirService: FhirService,
              private router: Router
  ) {}



  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.patients$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      catchError(this.logError('Patient')),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        console.log(this.systemType);
         return this.fhirService.searchPatients(term, this.systemType);
      }),
      map(bundle  => {
        var pat$: fhir.Patient[] = [];
        var i;
        if (bundle != undefined && bundle.hasOwnProperty("entry")) {
          for (i = 0; i < bundle.entry.length && i < 10; i++) {
            //console.log("Entry="+i);
            pat$[i] = <fhir.Patient>bundle.entry[i].resource;
          }
        }
        return pat$;}
        )
    );

  }


  selectPatient(patientId : number) {
    console.log("Patient clicked = " + patientId);
    if (patientId !=undefined) {
      if (this.systemType === 'EPR') {
        this.router.navigate(['epr/'+patientId ] );
      } else {
        this.router.navigate(['docs/'+patientId ] );
      }
    }
  }



  logError(title : string) {
      return (message :any) => {
        if(message instanceof HttpErrorResponse) {
          if (message.status == 401) {
            //this.messageService.add(title + ": 401 Unauthorised");
          }
          if (message.status == 403) {
            //this.messageService.add(title + ": 403 Forbidden (insufficient scope)");
          }
        }
        console.log(message);

        return Observable.never();

    }
  }
}
