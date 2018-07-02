import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {PatientEprService} from "../../service/patient-epr.service";

import {User} from "../../model/user";

import {FhirService} from "../../service/fhir.service";
import {environment} from "../../../environments/environment";
import {TdDigitsPipe, TdLayoutManageListComponent, TdMediaService, TdRotateAnimation} from "@covalent/core";
import {DatePipe} from "@angular/common";
import {MatDialog, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-epr',
  templateUrl: './epr.component.html',
  styleUrls: ['./epr.component.css'],
  animations: [
    TdRotateAnimation()
  ]
})
export class EprComponent implements AfterViewInit {


  // https://stackblitz.com/edit/covalent-dashboard?file=app%2Fapp.component.ts

  @ViewChild('manageList') manageList: TdLayoutManageListComponent;
 // @ViewChild('dialogContent') template: TemplateRef<any>;

  public miniNav: boolean = true;

  constructor(
    public media: TdMediaService,
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    public authService: AuthService,
              private fhirService : FhirService,
              public patientEprService : PatientEprService,
            ) {

  }

  routes = [ {
    title: 'Logout',
    route: '/logout',
    icon: 'exit_to_app',
  }
  ];

  btnRoutes = [{
    title: 'Patient',
    href: 'patient',
    icon: 'person',
  }, {
    title: 'Import Document',
    href: 'loaddocument',
    icon: 'note_addd',
  }
  ];


  usermenu = [{
    title: 'Profile',
    route: '/',
    icon: 'account_box',
  }, {
    title: 'Settings',
    route: '/',
    icon: 'settings',
  },
  ];

  name="Clinical Assurance Tool";


  patient : fhir.Patient;

  user: User;

  userName : string = undefined;
  email : string = undefined;

  subUser: any;

  subPatient : any;

  showMenu : boolean = false;

  section = 'documents';

  href :string = 'patient';

  ngOnInit() {

    this.subUser = this.authService.getUserEventEmitter()
      .subscribe(item => {

        this.user = item;
        this.userName = this.user.userName;
        this.email = this.user.email;

      });
    this.subPatient = this.patientEprService.getPatientChangeEmitter()
      .subscribe( patient => {
        this.patient = patient;
      });
    this.authService.setCookie();
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  toggleMiniNav(): void {
    this.miniNav = !this.miniNav;
    setTimeout(() => {
      this.manageList.sidenav._animationStarted.emit()
    });
  }
  selectSection(section : string) {

    this.patientEprService.setSection(section);
    this.section = section;
  }

  menuClick(href : string) {
    if (href=='patient') {
      this.patientEprService.set(undefined);
    }
    this.href= href;
  }
/*
  openTemplate() {
    this.dialog.open(this.template, this.config);
  }
*/
  // NGX Charts Axis
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }

  axisDate(val: string): string {
    return new DatePipe('en').transform(val, 'hh a');
  }

  menuToggle() {
      this.showMenu = !this.showMenu;
  }

  growthApp() {

    let launch : string = undefined;

    this.authService.getCookieEventEmitter().subscribe(
      ()=> {
        console.log('Smart Launch Growth Chart');
        this.fhirService.launchSMART('growth_chart','4ae23017813e417d937e3ba21974581',this.patientEprService.patient.id).subscribe( response => {
            launch = response.launch_id;
            console.log("Returned Launch = "+launch);
          },
          (err)=> {
            console.log(err);
          },
          () => {
            window.open(this.getGrowthChartAppUrl()+launch, "_blank");
          }
        );

      }
    );
    this.authService.setCookie();

  }

  selectPatient(patient : fhir.Patient) {
    if (patient !=undefined) {
      this.patientEprService.set(patient);
      this.href='epr';
    }
  }

  cardiacApp() {

    let launch : string = undefined;

    console.log('cardiac app clicked');

    this.authService.getCookieEventEmitter().subscribe(
      ()=> {
        console.log('Smart Launch Cardiac');
        this.fhirService.launchSMART('cardiac_risk', '4ae23017813e417d937e3ba21974582', this.patientEprService.patient.id).subscribe(response => {
            launch = response.launch_id;
            console.log("Returned Lauch = " + launch);
          },
          (err) => {
            console.log(err);
          },
          () => {
            window.open(this.getCardiacAppUrl() + launch, "_blank");
          }
        );
      }
    )
    this.authService.setCookie();

  }

  getCardiacAppUrl() : string {
    // This is a marker for entryPoint.sh to replace
    let url :string = 'SMART_CARDIAC_URL';
    if (url.indexOf('SMART_CARDIAC') != -1) url = environment.smart.cardiac;
    return url;
  }

  getGrowthChartAppUrl() : string {
    // This is a marker for entryPoint.sh to replace
    let url :string = 'SMART_GROWTH_CHART_URL';
    if (url.indexOf('SMART_GROWTH_CHART') != -1) url = environment.smart.growthChart;
    return url;
  }

  getLastName() : String {
    if (this.patient == undefined) return "";
    if (this.patient.name == undefined || this.patient.name.length == 0)
      return "";

    let name = "";
    if (this.patient.name[0].family != undefined) name += this.patient.name[0].family.toUpperCase();
    return name;

  }
  getFirstName() : String {
    if (this.patient == undefined) return "";
    if (this.patient.name == undefined || this.patient.name.length == 0)
      return "";
    // Move to address
    let name = "";
    if (this.patient.name[0].given != undefined && this.patient.name[0].given.length>0) name += ", "+ this.patient.name[0].given[0];

    if (this.patient.name[0].prefix != undefined && this.patient.name[0].prefix.length>0) name += " (" + this.patient.name[0].prefix[0] +")" ;
    return name;

  }

  getNHSIdentifier() : String {
    if (this.patient == undefined) return "";
    if (this.patient.identifier == undefined || this.patient.identifier.length == 0)
      return "";
    // Move to address
    var NHSNumber :String = "";
    for (var f=0;f<this.patient.identifier.length;f++) {
      if (this.patient.identifier[f].system.includes("nhs-number") )
        NHSNumber = this.patient.identifier[f].value;
    }
    return NHSNumber;

  }

}
