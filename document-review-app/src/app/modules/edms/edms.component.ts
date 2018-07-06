import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {EprService} from "../../service/epr.service";

import {User} from "../../model/user";

import {FhirService} from "../../service/fhir.service";
import {environment} from "../../../environments/environment";
import {TdDigitsPipe, TdLayoutManageListComponent, TdMediaService, TdRotateAnimation} from "@covalent/core";
import {DatePipe} from "@angular/common";
import {MatDialog, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {Oauth2Service} from "../../service/oauth2.service";

@Component({
  selector: 'app-edms',
  templateUrl: './edms.component.html',
  styleUrls: ['./edms.component.css'],
  animations: [
    TdRotateAnimation()
  ]
})
export class EdmsComponent implements AfterViewInit {


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
              public outh2Service : Oauth2Service,
              private fhirService : FhirService,
              public eprService : EprService,
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

  href :string = 'loaddocument';

  ngOnInit() {
   // console.log('Username = '+this.eprService.userName);
   // console.log('User email = '+this.eprService.userEmail);


   // TODO Get UserDetails from Token console.log('token '+this.outh2Service.getUser());

    this.subUser = this.authService.getUserEventEmitter()
      .subscribe(item => {

        this.user = item;
        this.userName = this.user.userName;
        this.email = this.user.email;

      });
    this.subPatient = this.eprService.getPatientChangeEmitter()
      .subscribe( patient => {
        this.patient = patient;
      });
     this.eprService.getSectionChangeEvent()
      .subscribe( section => {
        this.href = 'epr';
        this.section =section;
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

    this.eprService.setSection(section);
    this.section = section;
  }

  menuClick(href : string) {
    if (href=='patient') {
      this.eprService.set(undefined);
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
        this.fhirService.launchSMART('growth_chart','4ae23017813e417d937e3ba21974581',this.eprService.patient.id).subscribe( response => {
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
      this.eprService.set(patient);
      this.href='epr';
    }
  }

  cardiacApp() {

    let launch : string = undefined;

    console.log('cardiac app clicked');

    this.authService.getCookieEventEmitter().subscribe(
      ()=> {
        console.log('Smart Launch Cardiac');
        this.fhirService.launchSMART('cardiac_risk', '4ae23017813e417d937e3ba21974582', this.eprService.patient.id).subscribe(response => {
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

  getLastName(patient :fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.name == undefined || patient.name.length == 0)
      return "";

    let name = "";
    if (patient.name[0].family != undefined) name += patient.name[0].family.toUpperCase();
    return name;

  }
  getFirstName(patient :fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.name == undefined || patient.name.length == 0)
      return "";
    // Move to address
    let name = "";
    if (patient.name[0].given != undefined && patient.name[0].given.length>0) name += ", "+ patient.name[0].given[0];

    if (patient.name[0].prefix != undefined && patient.name[0].prefix.length>0) name += " (" + patient.name[0].prefix[0] +")" ;
    return name;

  }

  getNHSIdentifier(patient : fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.identifier == undefined || patient.identifier.length == 0)
      return "";
    // Move to address
    var NHSNumber :String = "";
    for (var f=0;f<patient.identifier.length;f++) {
      if (patient.identifier[f].system.includes("nhs-number") )
        NHSNumber = patient.identifier[f].value;
    }
    return NHSNumber;

  }

}
