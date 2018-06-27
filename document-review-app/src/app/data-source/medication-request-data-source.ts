import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";

import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

export class MedicationRequestDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService,
              public patientId : string,
              public issuess : fhir.MedicationRequest[]
  ) {
    super();
  }

  private dataStore: {
    issuess: fhir.MedicationRequest[]
  };

  connect(): Observable<fhir.MedicationRequest[]> {

    console.log('issuess DataSource connect '+this.patientId);
    let _issuess : BehaviorSubject<fhir.MedicationRequest[]> =<BehaviorSubject<fhir.MedicationRequest[]>>new BehaviorSubject([]);;

    this.dataStore = { issuess: [] };

    if (this.issuess != []) {
      for (let procedure of this.issuess) {
        this.dataStore.issuess.push(<fhir.MedicationRequest> procedure);
      }
      _issuess.next(Object.assign({}, this.dataStore).issuess);
    } else if (this.patientId != undefined) {
      this.fhirService.getEPRMedicationRequests(this.patientId).subscribe((bundle => {
        if (bundle != undefined && bundle.entry != undefined) {
          for (let entry of bundle.entry) {
            this.dataStore.issuess.push(<fhir.MedicationRequest> entry.resource);

          }
        }
        _issuess.next(Object.assign({}, this.dataStore).issuess);
      }));
    }

   return _issuess.asObservable();
  }

  disconnect() {}
}
