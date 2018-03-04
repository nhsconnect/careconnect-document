import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./component/load-document/load-document.component";
import {ViewDocumentComponent} from "./component/view-document/view-document.component";
import {PatientFindComponent} from "./component/patient-find/patient-find.component";
import {FindDocumentComponent} from "./component/find-document/find-document.component";

const routes: Routes = [
  { path: '', component: PatientFindComponent },
  { path: 'open', component: LoadDocumentComponent },
  { path: 'find', component: PatientFindComponent },
  { path: 'doc/:docid', component: ViewDocumentComponent},
  { path: 'docs/:patientId', component: FindDocumentComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
