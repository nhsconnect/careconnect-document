import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './component/composition-load/load-document.component';
import { NavComponent } from './component/nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LoadDocumentFileComponent } from './component/composition-load/load-document-file/load-document-file.component';
import {FileUploadModule} from "ng2-file-upload";
import { ViewDocumentComponent } from './component/composition-view/view-document.component';
import {FhirService} from "./service/fhir.service";
import {HttpClientModule} from "@angular/common/http";
import { ViewDocumentSectionComponent } from './component/composition-view/view-document-section.component';
import { PatientFindComponent } from './component/patient-edms-find/patient-find.component';
import { PatientSearchComponent } from './component/patient-search/patient-search.component';
import {PatientItemComponent} from "./component/patient-search/patient-item.component";
import { FindDocumentComponent } from './component/composition-find/find-document.component';
import { FindDocumentItemComponent } from './component/composition-find/find-document-item.component';

import { PatientEprFindComponent } from './component/patient-epr-find/patient-epr-find.component';
import { PatientEprPatientRecordComponent } from './component/patient-epr-record/patient-epr-patient-record.component';
import { PatientEprEncounterComponent } from './component/patient-epr-record/epr-encounter/patient-epr-encounter.component';
import { MedicationStatementComponent } from './component/composition-view/medication-statement/medication-statement.component';
import { ConditionComponent } from './component/composition-view/condition/condition.component';
import { ProcedureComponent } from './component/composition-view/procedure/procedure.component';
import { ObservationComponent } from './component/composition-view/observation/observation.component';
import { AllergyIntolleranceComponent } from './component/composition-view/allergy-intollerance/allergy-intollerance.component';
import { EncounterComponent } from './component/composition-view/encounter/encounter.component';
import { EprObservationComponent } from './component/patient-epr-record/epr-observation/epr-observation.component';






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
    PatientEprFindComponent,
    PatientEprPatientRecordComponent,
    PatientEprEncounterComponent,
    MedicationStatementComponent,
    ConditionComponent,
    ProcedureComponent,
    ObservationComponent,
    AllergyIntolleranceComponent,
    EncounterComponent,
    EprObservationComponent
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
