import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpErrorResponse} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {FhirService} from "../../service/fhir.service";
import {NEVER} from "rxjs/internal/observable/never";

@Component({
  selector: 'app-organisation-search',
  templateUrl: './organisation-search.component.html',
  styleUrls: ['./organisation-search.component.css']
})
export class OrganisationSearchComponent implements OnInit {


  organisations$: Observable<fhir.Organization[]>;
  private searchTerms = new Subject<string>();

  @Output() organisationSelected : EventEmitter<fhir.Organization> = new EventEmitter();

  constructor(private fhirService: FhirService

  ) {}

  ngOnInit(): void {
    this.organisations$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      catchError(this.logError('Patient')),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {

        return this.fhirService.searchOrganisations(term);
      }),
      map(bundle => {
          var orgs$: fhir.Organization[] = [];
          var i;
          if (bundle != undefined && bundle.hasOwnProperty("entry")) {
            for (i = 0; i < bundle.entry.length && i < 10; i++) {
              //console.log("Entry="+i);
              orgs$[i] = <fhir.Organization>bundle.entry[i].resource;
            }
          }
          return orgs$;
        }
      )
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  selectOrganisation(organization : fhir.Organization) {
    this.organisations$ = undefined;
    this.organisationSelected.emit(organization);
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
