import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./modules/document-load/load-document.component";
import {ViewDocumentComponent} from "./document-view-modules/composition-view/view-document.component";
import {FindDocumentComponent} from "./modules/composition-find/find-document.component";
import {PatientFindComponent} from "./modules/patient-find/patient-find.component";
import {PatientEprPatientRecordComponent} from "./epr-modules/patient-epr-record/patient-epr-patient-record.component";
import {ValidationLoadComponent} from "./modules/validation-load/validation-load.component";
import {LoginComponent} from "./modules/login/login.component";
import {AuthoriseComponent} from "./modules/authorise/authorise.component";
import {AuthGuard} from "./service/auth-guard";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'open', canActivate: [AuthGuard], component: LoadDocumentComponent },
  { path: 'find', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'epr/:docid', canActivate: [AuthGuard], component: PatientEprPatientRecordComponent},
  { path: 'epr/:docid/:tabid', canActivate: [AuthGuard], component: PatientEprPatientRecordComponent},
  { path: 'doc/:docid',canActivate: [AuthGuard], component: ViewDocumentComponent},
  { path: 'docs/:patientId', canActivate: [AuthGuard],component: FindDocumentComponent},
  { path: 'validate', canActivate: [AuthGuard],component: ValidationLoadComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
