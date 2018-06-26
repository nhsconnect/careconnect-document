import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {Observable } from "rxjs/observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class EncounterDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService, public patientId : string
  ) {
    super();
  }

  private dataStore: {
    encounters: fhir.Encounter[]
  };

  connect(): Observable<fhir.Encounter[]> {

    console.log('encounters DataSource connect '+this.patientId);
    let _encounters : BehaviorSubject<fhir.Encounter[]> =<BehaviorSubject<fhir.Encounter[]>>new BehaviorSubject([]);;

    this.dataStore = { encounters: [] };

    this.fhirService.getEPREncounters(this.patientId).subscribe((bundle => {
      if (bundle != undefined && bundle.entry != undefined) {
        for (let entry of bundle.entry) {
          this.dataStore.encounters.push(<fhir.Encounter> entry.resource);

        }
      }
      _encounters.next(Object.assign({}, this.dataStore).encounters);
    }));

   return _encounters.asObservable();
  }

  disconnect() {}
}
