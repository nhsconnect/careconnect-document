import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './component/load-document/load-document.component';
import { NavComponent } from './component/nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LoadDocumentFileComponent } from './component/load-document-file/load-document-file.component';
import {FileUploadModule} from "ng2-file-upload";
import { ViewDocumentComponent } from './component/view-document/view-document.component';
import {FhirService} from "./service/fhir.service";
import {HttpClientModule} from "@angular/common/http";
import { ViewDocumentSectionComponent } from './component/view-document/view-document-section.component';
import { PatientFindComponent } from './component/patient-find/patient-find.component';
import { PatientSearchComponent } from './component/patient-search/patient-search.component';
import {PatientItemComponent} from "./component/patient-search/patient-item.component";
import { FindDocumentComponent } from './component/find-document/find-document.component';
import { FindDocumentItemComponent } from './component/find-document/find-document-item.component';
import { SectionReferencesModalComponent } from './component/section-references-modal/section-references-modal.component';
import { PatientEprFindComponent } from './component/patient-epr-find/patient-epr-find.component';
import { PatientEprPatientRecordComponent } from './component/patient-epr-patient-record/patient-epr-patient-record.component';
import { PatientEprEncounterComponent } from './component/patient-epr-encounter/patient-epr-encounter.component';

// import { ModalModule } from 'ngx-modialog';
//import {BootstrapModalModule} from "ngx-modialog/plugins/bootstrap";




@NgModule({
  declarations: [
    AppComponent,
    LoadDocumentComponent,
    NavComponent,
    LoadDocumentFileComponent,
    ViewDocumentComponent,
    ViewDocumentSectionComponent,
    PatientFindComponent,
    PatientSearchComponent,
    PatientItemComponent,
    FindDocumentComponent,
    FindDocumentItemComponent,
    SectionReferencesModalComponent,
    PatientEprFindComponent,
    PatientEprPatientRecordComponent,
    PatientEprEncounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    HttpClientModule,
    NgbModule.forRoot(),
    //ModalModule.forRoot()
    //  ,BootstrapModalModule


  ],
  providers: [
    FhirService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
