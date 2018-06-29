import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

export class PractitionerDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService,

              public practitioners : fhir.Practitioner[]
  ) {
    super();
  }

  private dataStore: {
    practitioners: fhir.Practitioner[]
  };

  connect(): Observable<fhir.Practitioner[]> {


    let _practitioners : BehaviorSubject<fhir.Practitioner[]> =<BehaviorSubject<fhir.Practitioner[]>>new BehaviorSubject([]);;

    this.dataStore = { practitioners: [] };

    if (this.practitioners != undefined && this.practitioners != []) {
      for (let practitioner of this.practitioners) {
        this.dataStore.practitioners.push(<fhir.Practitioner> practitioner);
      }
      _practitioners.next(Object.assign({}, this.dataStore).practitioners);
    }

   return _practitioners.asObservable();
  }

  disconnect() {}
}
