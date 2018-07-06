import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FhirService} from "../../service/fhir.service";
import {EprService} from "../../service/epr.service";

import {KeycloakService} from "../../service/keycloak.service";


@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {


  constructor(private authService: AuthService,
              private router: Router,
              private  fhirService : FhirService
    ) {
  }


  ngOnInit() {
    // Perform a resource access to check access token.
    this.fhirService.getEPRPatient('1').subscribe( data => {
      this.router.navigate(['edms']);
    });

  }






}
