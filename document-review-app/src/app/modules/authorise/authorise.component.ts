import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Token} from '../../model/token';
import {FhirService} from '../../service/fhir.service';
import {Oauth2token} from '../../model/oauth2token';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authorise',
  templateUrl: './authorise.component.html',
  styleUrls: ['./authorise.component.css']
})
export class AuthoriseComponent implements OnInit {

  tokens : Array<Token> ;
  selectedToken : Token;
  scopes : Array<string>;

  oauth2token : Oauth2token;
  constructor(
    private FhirService : FhirService
    ,private router: Router
  ) {


  }

  doLogin(event) {
    console.log(event);

  }
  ngOnInit() {
    this.getTokens();
    this.selectedToken = new Token ('','','');
    this.oauth2token = new Oauth2token();

  }

  getTokens () :Array<Token> {
    this.tokens = [ new Token ('Patient Access','a24a4d9f-c264-4af7-a8e5-248c24a6b707',
      'MMpAOGBljYcEzBfn7q9-xgJqBlmR0BSiEyCrCjNNOUpR78kZtzqgKKU_4FgGRFNWbtc6jPIErLwoYwRgnlvijA'),
      new Token ('Patient, Condition & Medication Access','ed73b2cb-abd0-4f75-b9a2-5f9c0535b82c','QOm0VcqJqa9stA1R0MJzHjCN_uYdo0PkY8OT68UCk2XDFxFrAUjajuqOvIom5dISjKshx2YiU51mXtx7W5UOwQ'),
      new Token ('Limited Access','256fcc31-97bd-47d4-acbf-12409676ad5a','AI8OGCYWjvnj-NY0zaP0H2e6_El_yO2pq43wK4YKk8UnBR_JZ5ivkmkXFtlkiL6LKWsL8H7ksab0V_Hk9c4OeMI')];
    return this.tokens;
  }

  onSelect(type) {
   // this.selectedToken = null;
    console.log(type);
    if (this.tokens == undefined) {
      this.getTokens();
    }
    for (var i = 0; i < this.tokens.length; i++)
    {
      if (this.tokens[i].type == type) {
        this.selectedToken = this.tokens[i];
        this.onAuthorise();
      }
    }
  }
  onAuthorise() : void {
    this.FhirService.authoriseOAuth2(this.selectedToken.clientid,this.selectedToken.clientsecret).subscribe( response => {
      console.log(response);
      this.oauth2token =  response;
      this.scopes = this.oauth2token.scope.split(' ');
      localStorage.setItem("access_token",this.oauth2token.access_token);
      localStorage.setItem("access_type",this.selectedToken.type);
    },
      ()=> {},
      () => {
      /*
       setTimeout((router: Router) => {
          this.router.navigate(['home']);
        }, 2000);
        */
      }
      );


  }

}
