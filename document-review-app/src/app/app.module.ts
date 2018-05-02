import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './modules/composition-load/load-document.component';
import { NavComponent } from './modules/nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LoadDocumentFileComponent } from './modules/composition-load/load-document-file/load-document-file.component';
import {FileUploadModule} from "ng2-file-upload";
import { ViewDocumentComponent } from './document-view-modules/composition-view/view-document.component';
import {FhirService} from "./service/fhir.service";
import {HttpClientModule} from "@angular/common/http";
import { ViewDocumentSectionComponent } from './document-view-modules/composition-view-section/view-document-section.component';
import { PatientFindComponent } from './modules/patient-fdms-find/patient-find.component';
import { PatientSearchComponent } from './modules/patient-search/patient-search.component';
import {PatientItemComponent} from "./component/patient/patient-item.component";
import { FindDocumentComponent } from './modules/composition-find/find-document.component';
import { CompositionComponent } from './component/composition/composition.component';

import { PatientEprFindComponent } from './modules/patient-epr-find/patient-epr-find.component';
import { PatientEprPatientRecordComponent } from './epr-modules/patient-epr-record/patient-epr-patient-record.component';
import { EprEncounterComponent } from './epr-modules/epr-encounter/epr-encounter.component';
import { MedicationStatementComponent } from './component/medication-statement/medication-statement.component';
import { ConditionComponent } from './component/condition/condition.component';
import { ProcedureComponent } from './component/procedure/procedure.component';
import { ObservationComponent } from './component/observation/observation.component';
import { AllergyIntolleranceComponent } from './component/allergy-intollerance/allergy-intollerance.component';
import { EncounterComponent } from './component/encounter/encounter.component';
import { EprObservationComponent } from './epr-modules/epr-observation/epr-observation.component';
import { MedicationRequestComponent } from './component/medication-request/medication-request.component';
import { MedicationComponent } from './component/medication/medication.component';
import { EprPrescriptionComponent } from './epr-modules/epr-prescription/epr-prescription.component';
import { EprProcedureComponent } from './epr-modules/epr-procedure/epr-procedure.component';
import { ValidationLoadComponent } from './modules/validation-load/validation-load.component';
import { LoadFileComponent } from './modules/validation-load/load-file/load-file.component';
import { EprConditionComponent } from './epr-modules/epr-condition/epr-condition.component';
import { EprAllergyIntolleranceComponent } from './epr-modules/epr-allergy-intollerance/epr-allergy-intollerance.component';
import { DocumentReferenceComponent } from './component/document-reference/document-reference.component';
import { EprDocumentReferenceComponent } from './epr-modules/epr-document-reference/epr-document-reference.component';
import {AuthService} from "./service/auth.service";
import {LoginComponent} from "./modules/login/login.component";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {environment} from "../environments/environment";
import {AuthoriseComponent} from "./modules/authorise/authorise.component";
import {LinksService} from "./service/links.service";
import {PatientEprService} from "./service/patient-epr.service";
import {ObservationDetailComponent} from "./component/observation-detail/observation-detail.component";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {CareGoogleChartComponent} from "./component/care-google-chart/care-google-chart.component";
import { EprImmunisationComponent } from './epr-modules/epr-immunisation/epr-immunisation.component';
import { ImmunisationComponent } from './component/immunisation/immunisation.component';

import { PatientTimelineComponent } from './epr-modules/patient-timeline/patient-timeline.component';
import { EncounterDetailComponent } from './component/encounter-detail/encounter-detail.component';
import {DatabaseService} from "./service/database.service";



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
    CompositionComponent,
    PatientEprFindComponent,
    PatientEprPatientRecordComponent,
    EprEncounterComponent,
    MedicationStatementComponent,
    ConditionComponent,
    ProcedureComponent,
    ObservationComponent,
    AllergyIntolleranceComponent,
    EncounterComponent,
    EprObservationComponent,
    MedicationRequestComponent,
    MedicationComponent,
    EprPrescriptionComponent,
    EprProcedureComponent,
    ValidationLoadComponent,
    LoadFileComponent,
    EprConditionComponent,
    EprAllergyIntolleranceComponent,
    DocumentReferenceComponent,
    EprDocumentReferenceComponent,
    LoginComponent,
    AuthoriseComponent,
    CareGoogleChartComponent,
    ObservationDetailComponent,
    EprImmunisationComponent,
    ImmunisationComponent,
    PatientTimelineComponent,
    EncounterDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    FileUploadModule,
    HttpClientModule,
    Ng2GoogleChartsModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'ccri-angular'),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    FhirService
    , AuthService
    ,LinksService
    ,PatientEprService
    ,DatabaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
