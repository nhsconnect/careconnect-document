import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './modules/document-load/load-document.component';
import { EdmsComponent } from './modules/edms/edms.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadModule } from "ng2-file-upload";
import { ViewDocumentComponent } from './component/binary/composition-view/view-document.component';
import { FhirService } from "./service/fhir.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ViewDocumentSectionComponent } from './component/binary/composition-view-section/view-document-section.component';
import { PatientSearchComponent } from './component/patient-search/patient-search.component';

import { FindDocumentComponent } from './modules/composition-find/find-document.component';
import { CompositionComponent } from './component/composition/composition.component';
import { PatientFindComponent } from './modules/patient-find/patient-find.component';
import { EdmsRecordComponent } from './modules/edms-record/edms-record.component';

import { MedicationStatementComponent } from './component/medication-statement/medication-statement.component';
import { ConditionComponent } from './component/condition/condition.component';
import { ProcedureComponent } from './component/procedure/procedure.component';
import { ObservationComponent } from './component/observation/observation.component';
import { AllergyIntolleranceComponent } from './component/allergy-intollerance/allergy-intollerance.component';
import { EncounterComponent } from './component/encounter/encounter.component';
import { MedicationRequestComponent } from './component/medication-request/medication-request.component';
import { MedicationComponent } from './component/medication/medication.component';

import { DocumentReferenceComponent } from './component/document-reference/document-reference.component';
import {AuthService} from "./service/auth.service";
import {LoginComponent} from "./modules/login/login.component";


import {LinksService} from "./service/links.service";
import {EprService} from "./service/epr.service";
import {ObservationDetailComponent} from "./component/observation-detail/observation-detail.component";
import {CareGoogleChartComponent} from "./component/care-google-chart/care-google-chart.component";

import { ImmunisationComponent } from './component/immunisation/immunisation.component';

import { PatientTimelineComponent } from './component/patient-timeline/patient-timeline.component';
import { EncounterDetailComponent } from './component/encounter-detail/encounter-detail.component';
import { PractitionerSearchComponent } from './component/practitioner-search/practitioner-search.component';
import { OrganisationSearchComponent } from './component/organisation-search/organisation-search.component';
import { OrganisationComponent } from './component/organisation/organisation.component';
import { PractitionerComponent } from './component/practitioner/practitioner.component';

import {AuthGuard} from "./service/auth-guard";


import {LogoutComponent} from "./modules/logout/logout.component";
import { CallbackComponent } from './modules/callback/callback.component';
import {ErrorsHandler} from "./service/errors-handler";

import {KeycloakService} from "./service/keycloak.service";
import {TokenInterceptor} from "./service/token-interceptor";
import {Oauth2Service} from "./service/oauth2.service";
import { ResourceDialogComponent } from './dialog/resource-dialog/resource-dialog.component';
import { TreeModule } from 'angular-tree-component';

import { PdfViewerComponent } from './component/binary/pdf-viewer/pdf-viewer.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { ImgViewerComponent } from './component/binary/img-viewer/img-viewer.component';
import {ImageViewerModule} from '@hallysonh/ngx-imageviewer';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIcon,
  MatIconRegistry,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatSelectModule,

  MatSidenavModule,
  MatTableModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import {
  CovalentDialogsModule, CovalentFileModule,

  CovalentJsonFormatterModule,
  CovalentLayoutModule, CovalentMediaModule,
  CovalentMenuModule, CovalentNotificationsModule, TdFileInputComponent

} from "@covalent/core";
import {CovalentHttpModule} from "@covalent/http";
import {CovalentHighlightModule} from "@covalent/highlight";
import {CovalentMarkdownModule} from "@covalent/markdown";

import {PatientComponent} from "./component/patient/patient.component";
import {MedicationDialogComponent} from "./dialog/medication-dialog/medication-dialog.component";
import {CookieModule, CookieService} from "ngx-cookie";
import {IssueDialogComponent} from "./dialog/issue-dialog/issue-dialog.component";
import {LocationDialogComponent} from "./dialog/location-dialog/location-dialog.component";
import {PractitionerDialogComponent} from "./dialog/practitioner-dialog/practitioner-dialog.component";
import {OrganisationDialogComponent} from "./dialog/organisation-dialog/organisation-dialog.component";
import {LocationComponent} from "./component/location/location.component";
import {BundleService} from "./service/bundle.service";
import {PractitionerRoleComponent} from './component/practitioner-role/practitioner-role.component';
import {HealthcareServiceComponent} from "./component/healthcare-service/healthcare-service.component";
import {RouterModule} from "@angular/router";
import {BinaryComponent} from './component/binary/binary/binary.component';
import {PractitionerRoleDialogComponent} from "./dialog/practitioner-role-dialog/practitioner-role-dialog.component";
import {EncounterDialogComponent} from "./dialog/encounter-dialog/encounter-dialog.component";
import {PingComponent} from "./modules/ping/ping.component";



@NgModule({
  declarations: [
    AppComponent,
    LoadDocumentComponent,
    EdmsComponent,
    ViewDocumentComponent,
    ViewDocumentSectionComponent,
    PatientFindComponent,
    PatientSearchComponent,
    FindDocumentComponent,
    CompositionComponent,
    EdmsRecordComponent,

    MedicationStatementComponent,
    ConditionComponent,
    ProcedureComponent,
    ObservationComponent,
    AllergyIntolleranceComponent,
    EncounterComponent,

    MedicationRequestComponent,
    MedicationComponent,

    DocumentReferenceComponent,
    LoginComponent,
    LogoutComponent,
    CareGoogleChartComponent,
    ObservationDetailComponent,

    ImmunisationComponent,
    PatientTimelineComponent,
    EncounterDetailComponent,
    PractitionerSearchComponent,
    OrganisationSearchComponent,
    OrganisationComponent,
    PractitionerComponent,
    CallbackComponent,
    ResourceDialogComponent,

    PatientFindComponent,
    PatientComponent,
    PdfViewerComponent,
    ImgViewerComponent,
    MedicationDialogComponent,
    IssueDialogComponent,
    LocationDialogComponent,
    PractitionerDialogComponent,
    OrganisationDialogComponent,
    LocationComponent,
    PractitionerRoleComponent,
    HealthcareServiceComponent,
    BinaryComponent,
    PractitionerRoleDialogComponent,
    EncounterDialogComponent,
    PingComponent
  ],
  entryComponents: [
    ResourceDialogComponent,
    MedicationDialogComponent,
    IssueDialogComponent,
    LocationDialogComponent,
    PractitionerDialogComponent,
    OrganisationDialogComponent,
    PractitionerRoleDialogComponent,
    EncounterDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    CookieModule
      .forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FileUploadModule,
    HttpClientModule,
    NgbModule.forRoot(),
    TreeModule,
    PdfViewerModule,
    ImageViewerModule,

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
    MatMenuModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,


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
    CovalentDialogsModule,
    CovalentMediaModule,
    CovalentNotificationsModule

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
    ,EprService
    ,AuthGuard
    ,CookieService
    ,KeycloakService
    ,Oauth2Service
    ,BundleService
    ,MatIconRegistry,
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
export class AppModule {
  constructor(
    public matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
