import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";

import {Permission} from "../../model/permission";
import {AngularFireDatabase} from "angularfire2/database";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              private  fhirService : FhirService,
              public patientEprService : PatientEprService,
              private router : Router,
              public db : AngularFireDatabase) {

  }

  title="FHIR DocumentRef Viewer";


  smartAppUrl : string = "http://127.0.0.1:9000/launch.html?iss=http://localhost:8080/careconnect-gateway-secure/STU3&launch=";
  //smartAppUrl : string = "http://127.0.0.1:9000/launch.html?iss=https://purple.testlab.nhs.uk/careconnect-ri/STU3&launch=";
  //smartAppUrl : "http://127.0.0.1:9000/launch.html?fhirServiceUrl=http://purple.testlab.nhs.uk/careconnect-ri/STU3&patientId=";

  patient : fhir.Patient;

  permission : Permission;

  subscription: any;

  ngOnInit() {

    this.subscription = this.authService.getPermissionChange()
      .subscribe(item => {
        console.log('Nav Permission change callback ran');
        this.permission = item;
      });
  }


  smartApp() {
   // window.open(this.smartAppUrl+"4ae23017813e417d937e3ba21974581", "_blank");
    let launch : string = undefined;
    this.fhirService.launchSMART('4ae23017813e417d937e3ba21974581',this.patientEprService.patient.id).subscribe( response => {
          launch = response.launch_id;
          console.log("Returned Lauch = "+launch);
      },
      (err)=> {
        console.log(err);
      },
      () => {
        window.open(this.smartAppUrl+launch, "_blank");
      }
    );

  }

}
