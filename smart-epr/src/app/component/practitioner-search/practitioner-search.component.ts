import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import {FhirService} from "../../service/fhir.service";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {NEVER} from "rxjs/internal/observable/never";

@Component({
  selector: 'app-practitioner-search',
  templateUrl: './practitioner-search.component.html',
  styleUrls: ['./practitioner-search.component.css']
})
export class PractitionerSearchComponent implements OnInit {


  practitioners$: Observable<fhir.Practitioner[]>;
  private searchTerms = new Subject<string>();

  @Output() practitionerSelected : EventEmitter<fhir.Practitioner> = new EventEmitter();

  constructor(private fhirService: FhirService,
              private router: Router
  ) {}
  ngOnInit(): void {
    this.practitioners$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      catchError(this.logError('Patient')),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {

        return this.fhirService.searchPractitioners(term);
      }),
      map(bundle => {
          var prac$: fhir.Practitioner[] = [];
          var i;
          if (bundle != undefined && bundle.hasOwnProperty("entry")) {
            for (i = 0; i < bundle.entry.length && i < 10; i++) {
              //console.log("Entry="+i);
              prac$[i] = <fhir.Practitioner>bundle.entry[i].resource;
            }
          }
          return prac$;
        }
      )
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    console.log('key up ' + term);
    this.searchTerms.next(term);
  }

  selectPractitioner(practitioner : fhir.Practitioner) {
    this.practitioners$ = undefined;
    this.practitionerSelected.emit(practitioner);

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

        return NEVER;

      }
    }
}
