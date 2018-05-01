import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService,
              public patientEprService : PatientEprService,
              private router : Router) {

  }

  title="FHIR Document Viewer";

  patient : fhir.Patient;

  ngOnInit() {
  }
  logout () {
    return this.authService.logout();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn()
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
    window.open("http://127.0.0.1:9000/launch.html?fhirServiceUrl=https://purple.testlab.nhs.uk/careconnect-ri/STU3/metadata&patientId=1&launch=https://purple.testlab.nhs.uk/careconnect-ri/STU3/&iss=123", "_blank");
  }

}
