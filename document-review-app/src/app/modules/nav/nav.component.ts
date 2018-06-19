import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";

import {User} from "../../model/user";

import {FhirService} from "../../service/fhir.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              private fhirService : FhirService,
              public patientEprService : PatientEprService,
            ) {

  }

  title="FHIR DocumentRef Viewer";


  patient : fhir.Patient;

  user: User;

  userName : string = undefined;
  email : string = undefined;

  subUser: any;

  subPatient : any;

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
    if (url.indexOf('SMART_GROWTH_CHART') != -1) url = environment.smart.cardiac;
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
