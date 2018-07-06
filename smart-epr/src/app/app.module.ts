import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import { AppComponent } from './app.component';

import {BinaryComponent} from "./component/binary/binary/binary.component";
import {PractitionerSearchComponent} from "./component/practitioner-search/practitioner-search.component";
import {EncounterDialogComponent} from "./dialog/encounter-dialog/encounter-dialog.component";
import {CareGoogleChartComponent} from "./component/care-google-chart/care-google-chart.component";
import {PractitionerRoleComponent} from "./component/practitioner-role/practitioner-role.component";
import {MedicationComponent} from "./component/medication/medication.component";
import {CompositionComponent} from "./component/composition/composition.component";
import {MedicationRequestComponent} from "./component/medication-request/medication-request.component";

import {MedicationDialogComponent} from "./dialog/medication-dialog/medication-dialog.component";
import {HealthcareServiceComponent} from "./component/healthcare-service/healthcare-service.component";
import {EncounterDetailComponent} from "./component/encounter-detail/encounter-detail.component";
import {EncounterComponent} from "./component/encounter/encounter.component";
import {ObservationComponent} from "./component/observation/observation.component";
import {MedicationStatementComponent} from "./component/medication-statement/medication-statement.component";
import {ImmunisationComponent} from "./component/immunisation/immunisation.component";
import {IssueDialogComponent} from "./dialog/issue-dialog/issue-dialog.component";
import {PdfViewerComponent} from "./component/binary/pdf-viewer/pdf-viewer.component";
import {ImgViewerComponent} from "./component/binary/img-viewer/img-viewer.component";
import {OrganisationSearchComponent} from "./component/organisation-search/organisation-search.component";
import {ViewDocumentSectionComponent} from "./component/binary/composition-view-section/view-document-section.component";
import {PractitionerRoleDialogComponent} from "./dialog/practitioner-role-dialog/practitioner-role-dialog.component";
import {AllergyIntolleranceComponent} from "./component/allergy-intollerance/allergy-intollerance.component";
import {DocumentReferenceComponent} from "./component/document-reference/document-reference.component";
import {OrganisationDialogComponent} from "./dialog/organisation-dialog/organisation-dialog.component";


import {ObservationDetailComponent} from "./component/observation-detail/observation-detail.component";
import {LocationComponent} from "./component/location/location.component";
import {PractitionerDialogComponent} from "./dialog/practitioner-dialog/practitioner-dialog.component";
import {PatientSearchComponent} from "./component/patient-search/patient-search.component";
import {PatientFindComponent} from "./modules/patient-find/patient-find.component";
import {ConditionComponent} from "./component/condition/condition.component";


import {ViewDocumentComponent} from "./component/binary/composition-view/view-document.component";
import {PractitionerComponent} from "./component/practitioner/practitioner.component";
import {OrganisationComponent} from "./component/organisation/organisation.component";
import {ProcedureComponent} from "./component/procedure/procedure.component";
import {PatientComponent} from "./component/patient/patient.component";
import {LocationDialogComponent} from "./dialog/location-dialog/location-dialog.component";

import {EprRecordComponent} from "./modules/epr-record/epr-record.component";
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
import {ResourceDialogComponent} from "./dialog/resource-dialog/resource-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    EprComponent,
    ViewDocumentComponent,
    ViewDocumentSectionComponent,
    PatientFindComponent,
    PatientSearchComponent,

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
