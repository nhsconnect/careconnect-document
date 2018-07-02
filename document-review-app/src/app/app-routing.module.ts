import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./modules/login/login.component";
import {AuthGuard} from "./service/auth-guard";
import {LogoutComponent} from "./modules/logout/logout.component";
import {CallbackComponent} from "./modules/callback/callback.component";
import {EprComponent} from "./modules/epr/epr.component";


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'logout', component: LogoutComponent },
 // { path: 'home', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'epr', canActivate: [AuthGuard], component: EprComponent },
  { path: 'logout', component: LogoutComponent },
 /* { path: 'loaddocument', canActivate: [AuthGuard], component: LoadDocumentComponent },
  { path: 'find', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'epr/:patientId', canActivate: [AuthGuard], component: EprComponent},
  { path: 'epr/:patientId/:tabid', canActivate: [AuthGuard], component: EprRecordComponent},
  { path: 'doc/:binaryId',canActivate: [AuthGuard], component: ViewDocumentComponent},
  { path: 'pdf/:binaryId',canActivate: [AuthGuard], component: PdfViewerComponent},
  { path: 'img/:binaryId',canActivate: [AuthGuard], component: ImgViewerComponent},
  { path: 'docs/:patientId', canActivate: [AuthGuard],component: FindDocumentComponent}, */
  { path: 'callback', component: CallbackComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
