import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {Observable } from "rxjs/observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class ProcedureDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService, public patientId : string
  ) {
    super();
  }

  private dataStore: {
    procedures: fhir.Procedure[]
  };

  connect(): Observable<fhir.Procedure[]> {

    console.log('procedures DataSource connect '+this.patientId);
    let _procedures : BehaviorSubject<fhir.Procedure[]> =<BehaviorSubject<fhir.Procedure[]>>new BehaviorSubject([]);;

    this.dataStore = { procedures: [] };

    this.fhirService.getEPRProcedures(this.patientId).subscribe((bundle => {
      if (bundle != undefined && bundle.entry != undefined) {
        for (let entry of bundle.entry) {
          this.dataStore.procedures.push(<fhir.Procedure> entry.resource);

        }
      }
      _procedures.next(Object.assign({}, this.dataStore).procedures);
    }));

   return _procedures.asObservable();
  }

  disconnect() {}
}
