import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {Observable } from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class ObservationDataSource extends DataSource<any> {
  constructor(private fhirService: FhirService) {
    super();
  }

  private dataStore: {
    obs: fhir.Observation[]
  };

  connect(patientId): Observable<fhir.Observation[]> {

    let _obs : BehaviorSubject<fhir.Observation[]> =<BehaviorSubject<fhir.Observation[]>>new BehaviorSubject([]);;

    this.dataStore = { obs: [] };

    this.fhirService.getEPRObservations("2").subscribe((bundle => {
      for(let entry of bundle.entry) {
        this.dataStore.obs.push(<fhir.Observation> entry.resource);

      }
      _obs.next(Object.assign({}, this.dataStore).obs);
    }));

   return _obs.asObservable();
  }

  disconnect() {}
}
