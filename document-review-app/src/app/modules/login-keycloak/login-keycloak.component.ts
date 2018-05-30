import { Component, OnInit } from '@angular/core';
import {KeycloakService} from "../../service/keycloak.service";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-login-keycloak',
  templateUrl: './login-keycloak.component.html',
  styleUrls: ['./login-keycloak.component.css']
})
export class LoginKeycloakComponent implements OnInit {


  // https://symbiotics.co.za/integrating-keycloak-with-an-angular-4-web-application/

  products: string[] = [];

  constructor(private http: HttpClient, private kc: KeycloakService) { }

  ngOnInit() {
  }

  logout() {
    this.kc.logout();
  }

  reloadData() {
    //angular dont have http interceptor yet
    this.kc.getToken()
      .then(token => {

        /*
        let headers = new Headers({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        });

        let options = new RequestOptions({ headers });

        this.http.get('/database/products', options)
          .map(res => {
            let decodedString = String.fromCharCode.apply(null, new Uint8Array(res));
            return JSON.parse(decodedString);
          }

          )
          .subscribe(prods => this.products = prods,
            error => console.log(error));
      })
      .catch(error => console.log(error));
        */
      });
  }

  private handleError(error: Response) {
    console.error(error);
    //return Observable.throw(error.json().error || 'Server error');
  }

}
