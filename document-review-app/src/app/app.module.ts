import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './modules/document-load/load-document.component';
import { NavComponent } from './modules/nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FileUploadModule} from "ng2-file-upload";
import { ViewDocumentComponent } from './document-view/composition-view/view-document.component';
import {FhirService} from "./service/fhir.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ViewDocumentSectionComponent } from './document-view/composition-view-section/view-document-section.component';
import { PatientSearchComponent } from './component/patient-search/patient-search.component';

import { FindDocumentComponent } from './modules/composition-find/find-document.component';
import { CompositionComponent } from './component/composition/composition.component';
import { PatientFindComponent } from './modules/patient-find/patient-find.component';
import { PatientEprPatientRecordComponent } from './epr-modules/patient-epr-record/patient-epr-patient-record.component';
import { EprEncounterComponent } from './epr-modules/epr-encounter/epr-encounter.component';
import { MedicationStatementComponent } from './component/medication-statement/medication-statement.component';
import { ConditionComponent } from './component/condition/condition.component';
import { ProcedureComponent } from './component/procedure/procedure.component';
import { ObservationComponent } from './component/observation/observation.component';
import { AllergyIntolleranceComponent } from './component/allergy-intollerance/allergy-intollerance.component';
import { EncounterComponent } from './component/encounter/encounter.component';
import { MedicationRequestComponent } from './component/medication-request/medication-request.component';
import { MedicationComponent } from './component/medication/medication.component';
import { EprPrescriptionComponent } from './epr-modules/epr-prescription/epr-prescription.component';
import { EprProcedureComponent } from './epr-modules/epr-procedure/epr-procedure.component';
import { TestLoadComponent } from './modules/test-load/test-load.component';
import { EprConditionComponent } from './epr-modules/epr-condition/epr-condition.component';
import { EprAllergyIntolleranceComponent } from './epr-modules/epr-allergy-intollerance/epr-allergy-intollerance.component';
import { DocumentReferenceComponent } from './component/document-reference/document-reference.component';
import { EprDocumentReferenceComponent } from './epr-modules/epr-document-reference/epr-document-reference.component';
import {AuthService} from "./service/auth.service";
import {LoginComponent} from "./modules/login/login.component";


import {LinksService} from "./service/links.service";
import {PatientEprService} from "./service/patient-epr.service";
import {ObservationDetailComponent} from "./component/observation-detail/observation-detail.component";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {CareGoogleChartComponent} from "./component/care-google-chart/care-google-chart.component";
import { EprImmunisationComponent } from './epr-modules/epr-immunisation/epr-immunisation.component';
import { ImmunisationComponent } from './component/immunisation/immunisation.component';

import { PatientTimelineComponent } from './epr-modules/patient-timeline/patient-timeline.component';
import { EncounterDetailComponent } from './component/encounter-detail/encounter-detail.component';
import { PractitionerSearchComponent } from './component/practitioner-search/practitioner-search.component';
import { OrganisationSearchComponent } from './component/organisation-search/organisation-search.component';
import { OrganisationComponent } from './component/organisation/organisation.component';
import { PractitionerComponent } from './component/practitioner/practitioner.component';
import {TestPipe} from "./modules/test-load/TestPipe";
import {AuthGuard} from "./service/auth-guard";
import {CookieService} from "angular2-cookie/core";

import {LogoutComponent} from "./modules/logout/logout.component";
import { CallbackComponent } from './modules/callback/callback.component';
import {ErrorsHandler} from "./service/errors-handler";

import {KeycloakService} from "./service/keycloak.service";
import {TokenInterceptor} from "./service/token-interceptor";
import {Oauth2Service} from "./service/oauth2.service";
import { ResourceDialogComponent } from './component/resource-dialog/resource-dialog.component';
import { TreeModule } from 'angular-tree-component';
import { EprPatientComponent } from './epr-modules/epr-patient/epr-patient.component';
import { PatientListComponent } from './component/patient-list/patient-list.component';
import { OrganisationListComponent } from './component/organisation-list/organisation-list.component';
import { PractitionerListComponent } from './component/practitioner-list/practitioner-list.component';
import { PdfViewerComponent } from './document-view/pdf-viewer/pdf-viewer.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { ImgViewerComponent } from './document-view/img-viewer/img-viewer.component';
import {ImageViewerModule} from '@hallysonh/ngx-imageviewer';
import {
  DateAdapter, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE, MatButtonModule, MatCardModule,
  MatDatepickerModule, MatDialogModule, MatGridListModule, MatIcon, MatIconModule,
  MatInputModule, MatListModule, MatPaginatorModule, MatSelectModule,

  MatSidenavModule, MatTableModule, MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import {
  CovalentDialogsModule,

  CovalentJsonFormatterModule,
  CovalentLayoutModule,
  CovalentMenuModule

} from "@covalent/core";
import {CovalentHttpModule} from "@covalent/http";
import {CovalentHighlightModule} from "@covalent/highlight";
import {CovalentMarkdownModule} from "@covalent/markdown";

import {PatientComponent} from "./component/patient/patient.component";
import {ObservationDataSource} from "./data-source/observation-data-source";


@NgModule({
  declarations: [
    AppComponent,
    LoadDocumentComponent,
    NavComponent,
    ViewDocumentComponent,
    ViewDocumentSectionComponent,
    PatientFindComponent,
    PatientSearchComponent,
    FindDocumentComponent,
    CompositionComponent,
    PatientEprPatientRecordComponent,
    EprEncounterComponent,
    MedicationStatementComponent,
    ConditionComponent,
    ProcedureComponent,
    ObservationComponent,
    AllergyIntolleranceComponent,
    EncounterComponent,

    MedicationRequestComponent,
    MedicationComponent,
    EprPrescriptionComponent,
    EprProcedureComponent,
    TestLoadComponent,
    EprConditionComponent,
    EprAllergyIntolleranceComponent,
    DocumentReferenceComponent,
    EprDocumentReferenceComponent,
    LoginComponent,
    LogoutComponent,
    CareGoogleChartComponent,
    ObservationDetailComponent,
    EprImmunisationComponent,
    ImmunisationComponent,
    PatientTimelineComponent,
    EncounterDetailComponent,
    PractitionerSearchComponent,
    OrganisationSearchComponent,
    OrganisationComponent,
    PractitionerComponent,
    TestPipe,
    CallbackComponent,
    ResourceDialogComponent,
    EprPatientComponent,
    PatientListComponent,
    PatientFindComponent,
    PatientComponent,
    OrganisationListComponent,
    PractitionerListComponent,
    PdfViewerComponent,
    ImgViewerComponent
    //TdFileUploadComponent
  ],
  entryComponents: [
    ResourceDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    HttpClientModule,
    Ng2GoogleChartsModule,
    NgbModule.forRoot(),
    TreeModule,
    PdfViewerModule,
    ImageViewerModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatGridListModule,
    MatDialogModule,
    MatPaginatorModule,


    CovalentLayoutModule,

    /*
    CovalentStepsModule,
    */
    // (optional) Additional Covalent Modules imports

    CovalentHttpModule.forRoot(),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentJsonFormatterModule,
    CovalentMenuModule,
    CovalentDialogsModule
   // CovalentFileModule

/*
    // Issue with https://github.com/Teradata/covalent/issues/1152
    CovalentDynamicFormsModule
*/
  ],
  providers: [
    FhirService
    //,ObservationDataSource
    , AuthService
    ,LinksService
    ,PatientEprService
    ,AuthGuard
    ,CookieService
    ,KeycloakService
    ,Oauth2Service,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
