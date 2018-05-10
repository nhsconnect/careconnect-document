import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";

import {Permission} from "../../model/permission";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              public patientEprService : PatientEprService,
              private router : Router,
              public db : AngularFireDatabase) {

  }

  title="FHIR DocumentRef Viewer";


  smartAppUrl : string = "http://127.0.0.1:9000/launch.html?iss=https://purple.testlab.nhs.uk/careconnect-ri/STU3&iss=";
  //smartAppUrl : "http://127.0.0.1:9000/launch.html?fhirServiceUrl=http://purple.testlab.nhs.uk/careconnect-ri/STU3&patientId=";

  patient : fhir.Patient;

  permission : Permission;

  ngOnInit() {

  }
  logout () {
    return this.authService.logout();
  }

  isLoggedIn(){
    let isLoggedIn : boolean =this.authService.isLoggedIn();

    return isLoggedIn;
  }
  hasPatient() : boolean {
    if (this.patientEprService.patient != undefined) {
      this.patient = this.patientEprService.patient;
    }
    return false;
  }
  hasAuthorised() : boolean {
    if (localStorage.getItem('access_token') != undefined && localStorage.getItem('access_token') != null) return true;
    return false;
  }
  getType() : string {
    if (localStorage.getItem('access_type') != undefined) return localStorage.getItem('access_type');
    return "";
  }
  deAuthorise() : void {
    localStorage.removeItem('access_token');
    localStorage.removeItem("PatientBanner");
  }
  Authorise() : void {
    this.router.navigate(['authorise']);
  }


  smartApp() {
    window.open(this.smartAppUrl+"4ae23017813e417d937e3ba21974581", "_blank");
    //window.open("http://127.0.0.1:9000/launch.html?fhirServiceUrl=http://127.0.0.1:8080/careconnect-gateway/STU3&patientId="+this.patientEprService.patient.id, "_blank");
  }

}
