import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";

import {Permission} from "../../model/permission";

import {FhirService} from "../../service/fhir.service";

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

  cardiacAppUrl : string = "http://127.0.0.1:8000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=";
  growthAppUrl : string = "http://127.0.0.1:9000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=";

  patient : fhir.Patient;

  permission : Permission;

  subPermission: any;

  subPatient : any;

  name : string = "";

  email : string = "";


  ngOnInit() {

    this.subPermission = this.authService.getPermissionEventEmitter()
      .subscribe(item => {

        this.permission = item;
        this.name= this.permission.userName;
        this.email = "email address";
      });
    this.subPatient = this.patientEprService.getPatientChangeEmitter()
      .subscribe( patient => {
        this.patient = patient;
      });

  }


  growthApp() {

    let launch : string = undefined;

    this.authService.getCookieEventEmitter().subscribe(
      ()=> {
        this.fhirService.launchSMART('growth_chart','4ae23017813e417d937e3ba21974581',this.patientEprService.patient.id).subscribe( response => {
            launch = response.launch_id;
            console.log("Returned Lauch = "+launch);
          },
          (err)=> {
            console.log(err);
          },
          () => {
            window.open(this.growthAppUrl+launch, "_blank");
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
        this.fhirService.launchSMART('cardiac_risk', '4ae23017813e417d937e3ba21974582', this.patientEprService.patient.id).subscribe(response => {
            launch = response.launch_id;
            console.log("Returned Lauch = " + launch);
          },
          (err) => {
            console.log(err);
          },
          () => {
            window.open(this.cardiacAppUrl + launch, "_blank");
          }
        );
      }
    )

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
