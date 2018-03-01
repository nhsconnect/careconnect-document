import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./component/load-document/load-document.component";
import {ViewDocumentComponent} from "./component/view-document/view-document.component";

const routes: Routes = [
  { path: '', component: LoadDocumentComponent },
  { path: 'doc/:docid', component: ViewDocumentComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
