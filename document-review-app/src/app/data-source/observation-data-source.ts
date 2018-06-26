import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {Observable } from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class ObservationDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService, public patientId : string
  ) {
    super();
  }

  private dataStore: {
    obs: fhir.Observation[]
  };

  connect(): Observable<fhir.Observation[]> {

    console.log('Obs DataSource connect '+this.patientId);
    let _obs : BehaviorSubject<fhir.Observation[]> =<BehaviorSubject<fhir.Observation[]>>new BehaviorSubject([]);;

    this.dataStore = { obs: [] };

    this.fhirService.getEPRObservations(this.patientId).subscribe((bundle => {
      if (bundle != undefined && bundle.entry != undefined) {
        for (let entry of bundle.entry) {
          this.dataStore.obs.push(<fhir.Observation> entry.resource);

        }
      }
      _obs.next(Object.assign({}, this.dataStore).obs);
    }));

   return _obs.asObservable();
  }

  disconnect() {}
}
