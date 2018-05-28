import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  private authCode :string ;

  subOAuth2 : any;

  subPermission : any;

  constructor(private activatedRoute: ActivatedRoute
    ,private  fhirService : FhirService
    ,private router: Router
    ,public authService: AuthService) { }

  ngOnInit() {
    this.authCode = this.activatedRoute.snapshot.queryParams['code'];



    if (this.authCode !==undefined) {
/*
      this.subOAuth2 = this.fhirService.getOAuthChangeEmitter()
        .subscribe(item => {
          console.log("Callback OAuth2 Call back ran");

        },
          ()=> {},

        ()=> {


        });
*/
      this.subPermission = this.authService.getPermissionEventEmitter()
        .subscribe(item => {
          console.log('Callback Nav Permission change callback ran');
          this.router.navigateByUrl('home').then( ()=> { console.log('Navigate by Url'); });
          // Potentially a loop but need to record the access token
          this.authService.setDbPermission(this.authService.getPermission());
        });

      this.fhirService.performGetAccessToken(this.authCode);
    }
  }

}
