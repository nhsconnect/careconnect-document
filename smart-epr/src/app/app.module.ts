import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import { AppComponent } from './app.component';

import {BinaryComponent} from "../../../document-review-app/src/app/component/binary/binary/binary.component";
import {PractitionerSearchComponent} from "../../../document-review-app/src/app/component/practitioner-search/practitioner-search.component";
import {EncounterDialogComponent} from "../../../document-review-app/src/app/dialog/encounter-dialog/encounter-dialog.component";
import {CareGoogleChartComponent} from "../../../document-review-app/src/app/component/care-google-chart/care-google-chart.component";
import {PractitionerRoleComponent} from "../../../document-review-app/src/app/component/practitioner-role/practitioner-role.component";
import {MedicationComponent} from "../../../document-review-app/src/app/component/medication/medication.component";
import {CompositionComponent} from "../../../document-review-app/src/app/component/composition/composition.component";
import {MedicationRequestComponent} from "../../../document-review-app/src/app/component/medication-request/medication-request.component";

import {MedicationDialogComponent} from "../../../document-review-app/src/app/dialog/medication-dialog/medication-dialog.component";
import {HealthcareServiceComponent} from "../../../document-review-app/src/app/component/healthcare-service/healthcare-service.component";
import {EncounterDetailComponent} from "../../../document-review-app/src/app/component/encounter-detail/encounter-detail.component";
import {EncounterComponent} from "../../../document-review-app/src/app/component/encounter/encounter.component";
import {ResourceDialogComponent} from "../../../document-review-app/src/app/dialog/resource-dialog/resource-dialog.component";
import {ObservationComponent} from "../../../document-review-app/src/app/component/observation/observation.component";
import {MedicationStatementComponent} from "../../../document-review-app/src/app/component/medication-statement/medication-statement.component";
import {ImmunisationComponent} from "../../../document-review-app/src/app/component/immunisation/immunisation.component";
import {IssueDialogComponent} from "../../../document-review-app/src/app/dialog/issue-dialog/issue-dialog.component";
import {PdfViewerComponent} from "../../../document-review-app/src/app/component/binary/pdf-viewer/pdf-viewer.component";
import {ImgViewerComponent} from "../../../document-review-app/src/app/component/binary/img-viewer/img-viewer.component";
import {OrganisationSearchComponent} from "../../../document-review-app/src/app/component/organisation-search/organisation-search.component";
import {ViewDocumentSectionComponent} from "../../../document-review-app/src/app/component/binary/composition-view-section/view-document-section.component";
import {PractitionerRoleDialogComponent} from "../../../document-review-app/src/app/dialog/practitioner-role-dialog/practitioner-role-dialog.component";
import {AllergyIntolleranceComponent} from "../../../document-review-app/src/app/component/allergy-intollerance/allergy-intollerance.component";
import {DocumentReferenceComponent} from "../../../document-review-app/src/app/component/document-reference/document-reference.component";
import {OrganisationDialogComponent} from "../../../document-review-app/src/app/dialog/organisation-dialog/organisation-dialog.component";
import {PatientTimelineComponent} from "../../../document-review-app/src/app/component/patient-timeline/patient-timeline.component";


import {ObservationDetailComponent} from "../../../document-review-app/src/app/component/observation-detail/observation-detail.component";
import {LocationComponent} from "../../../document-review-app/src/app/component/location/location.component";
import {PractitionerDialogComponent} from "../../../document-review-app/src/app/dialog/practitioner-dialog/practitioner-dialog.component";
import {PatientSearchComponent} from "../../../document-review-app/src/app/component/patient-search/patient-search.component";
import {LoadDocumentComponent} from "../../../document-review-app/src/app/modules/document-load/load-document.component";
import {PatientFindComponent} from "../../../document-review-app/src/app/modules/patient-find/patient-find.component";
import {ConditionComponent} from "../../../document-review-app/src/app/component/condition/condition.component";


import {ViewDocumentComponent} from "../../../document-review-app/src/app/component/binary/composition-view/view-document.component";
import {PractitionerComponent} from "../../../document-review-app/src/app/component/practitioner/practitioner.component";
import {OrganisationComponent} from "../../../document-review-app/src/app/component/organisation/organisation.component";
import {ProcedureComponent} from "../../../document-review-app/src/app/component/procedure/procedure.component";
import {PatientComponent} from "../../../document-review-app/src/app/component/patient/patient.component";
import {LocationDialogComponent} from "../../../document-review-app/src/app/dialog/location-dialog/location-dialog.component";
import {FindDocumentComponent} from "../../../document-review-app/src/app/modules/composition-find/find-document.component";
import {EprRecordComponent} from "../../../document-review-app/src/app/modules/epr-record/epr-record.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CovalentHttpModule} from "@covalent/http";
import {CovalentHighlightModule} from "@covalent/highlight";
import {
  CovalentDialogsModule, CovalentJsonFormatterModule, CovalentLayoutModule,
  CovalentMediaModule,
  CovalentMenuModule,
  CovalentNotificationsModule
} from "@covalent/core";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {CookieModule, CookieService} from "ngx-cookie";
import {FileUploadModule} from "ng2-file-upload";
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatButtonModule, MatCardModule,
  MatDatepickerModule, MatDialogModule, MatGridListModule, MatIconModule, MatIconRegistry,
  MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule
} from "@angular/material";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ImageViewerModule} from '@hallysonh/ngx-imageviewer';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./modules/login/login.component";
import {LogoutComponent} from "./modules/logout/logout.component";
import {PingComponent} from "./modules/ping/ping.component";
import {EprComponent} from "./modules/epr/epr.component";
import {CallbackComponent} from "./modules/callback/callback.component";
import {FhirService} from "./service/fhir.service";
import {AuthService} from "./service/auth.service";
import {LinksService} from "./service/links.service";
import {EprService} from "./service/epr.service";
import {AuthGuard} from "./service/auth-guard";
import {KeycloakService} from "./service/keycloak.service";
import {Oauth2Service} from "./service/oauth2.service";
import {BundleService} from "./service/bundle.service";
import {ErrorsHandler} from "./service/errors-handler";
import {TokenInterceptor} from "./service/token-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoadDocumentComponent,
    EprComponent,
    ViewDocumentComponent,
    ViewDocumentSectionComponent,
    PatientFindComponent,
    PatientSearchComponent,
    FindDocumentComponent,
    CompositionComponent,
    EprRecordComponent,

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
  /*,
  entryComponents: [
    ResourceDialogComponent,
    MedicationDialogComponent,
    IssueDialogComponent,
    LocationDialogComponent,
    PractitionerDialogComponent,
    OrganisationDialogComponent,
    PractitionerRoleDialogComponent,
    EncounterDialogComponent
  ],*/
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
