import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

export class OrganisationDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService,

              public organisations : fhir.Organization[]
  ) {
    super();
  }

  private dataStore: {
    organisations: fhir.Organization[]
  };

  connect(): Observable<fhir.Organization[]> {


    let _organisations : BehaviorSubject<fhir.Organization[]> =<BehaviorSubject<fhir.Organization[]>>new BehaviorSubject([]);;

    this.dataStore = { organisations: [] };

    if (this.organisations != undefined && this.organisations != []) {
      for (let organisation of this.organisations) {
        this.dataStore.organisations.push(<fhir.Organization> organisation);
      }
      _organisations.next(Object.assign({}, this.dataStore).organisations);
    }

   return _organisations.asObservable();
  }

  disconnect() {}
}
