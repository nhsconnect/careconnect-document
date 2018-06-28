import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./modules/document-load/load-document.component";
import {ViewDocumentComponent} from "./component/binary-view/composition-view/view-document.component";
import {FindDocumentComponent} from "./modules/composition-find/find-document.component";
import {PatientFindComponent} from "./modules/patient-find/patient-find.component";
import {PatientEprPatientRecordComponent} from "./modules/epr-record/patient-epr-patient-record.component";
import {TestLoadComponent} from "./modules/test-load/test-load.component";
import {LoginComponent} from "./modules/login/login.component";
import {AuthGuard} from "./service/auth-guard";
import {LogoutComponent} from "./modules/logout/logout.component";
import {CallbackComponent} from "./modules/callback/callback.component";
import {PdfViewerComponent} from "./component/binary-view/pdf-viewer/pdf-viewer.component";
import {ImgViewerComponent} from "./component/binary-view/img-viewer/img-viewer.component";


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'logout', component: LogoutComponent },
  { path: 'home', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'open', canActivate: [AuthGuard], component: LoadDocumentComponent },
  { path: 'find', canActivate: [AuthGuard], component: PatientFindComponent },
  { path: 'epr/:patientId', canActivate: [AuthGuard], component: PatientEprPatientRecordComponent},
  { path: 'epr/:patientId/:tabid', canActivate: [AuthGuard], component: PatientEprPatientRecordComponent},
  { path: 'doc/:binaryId',canActivate: [AuthGuard], component: ViewDocumentComponent},
  { path: 'pdf/:binaryId',canActivate: [AuthGuard], component: PdfViewerComponent},
  { path: 'img/:binaryId',canActivate: [AuthGuard], component: ImgViewerComponent},
  { path: 'docs/:patientId', canActivate: [AuthGuard],component: FindDocumentComponent},
  { path: 'test', canActivate: [AuthGuard],component: TestLoadComponent },
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
