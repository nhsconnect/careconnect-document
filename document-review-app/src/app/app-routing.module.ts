import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./modules/composition-load/load-document.component";
import {ViewDocumentComponent} from "./modules/composition-view/view-document.component";
import {PatientFindComponent} from "./modules/patient-fdms-find/patient-find.component";
import {FindDocumentComponent} from "./component/composition-find/find-document.component";
import {PatientEprFindComponent} from "./modules/patient-epr-find/patient-epr-find.component";
import {PatientEprPatientRecordComponent} from "./modules/patient-epr-record/patient-epr-patient-record.component";
import {ValidationLoadComponent} from "./modules/validation-load/validation-load.component";

const routes: Routes = [
  { path: '', component: PatientFindComponent },
  { path: 'open', component: LoadDocumentComponent },
  { path: 'find', component: PatientFindComponent },
  { path: 'findEPR', component: PatientEprFindComponent },
  { path: 'epr/:docid', component: PatientEprPatientRecordComponent},
  { path: 'doc/:docid', component: ViewDocumentComponent},
  { path: 'docs/:patientId', component: FindDocumentComponent},
  { path: 'load', component: ValidationLoadComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
