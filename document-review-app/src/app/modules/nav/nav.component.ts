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
              private fhirService : FhirService,
              public patientEprService : PatientEprService,
            ) {

  }

  title="FHIR DocumentRef Viewer";

  cardiacAppUrl : string = "http://127.0.0.1:8000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=";
  growthAppUrl : string = "http://127.0.0.1:9000/launch.html?iss=http://localhost:9090/careconnect-gateway-secure/STU3&launch=";

  patient : fhir.Patient;

  permission : Permission;

  subscriptionPermission: any;



  ngOnInit() {

    this.subscriptionPermission = this.authService.getPermissionEventEmitter()
      .subscribe(item => {
        console.log('Nav Permission change callback ran');
        this.permission = item;
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

}
