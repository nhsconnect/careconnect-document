import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  private authCode :string ;

  subscription: any;

  constructor(private activatedRoute: ActivatedRoute
    ,private  fhirService : FhirService
    , private router: Router) { }

  ngOnInit() {
    this.authCode = this.activatedRoute.snapshot.queryParams['code'];



    if (this.authCode !==undefined) {

      this.subscription = this.fhirService.getOAuthChangeEmitter()
        .subscribe(item => {
          console.log("The Call back ran");

        },
          ()=> {},

        ()=> {
          window.location.href = '';
          this.router.navigate(['home']);
        });

      this.fhirService.performGetAccessToken(this.authCode);
    }
  }

}
