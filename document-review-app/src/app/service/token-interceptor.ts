import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Oauth2Service} from "./oauth2.service";
import {Observable} from "rxjs/Observable";
import {FhirService} from "./fhir.service";
import 'rxjs/add/operator/do';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  // https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors

  constructor(private oauth2 : Oauth2Service, public fhir : FhirService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // FHIR resource requests only
       if ((request.url.indexOf(this.fhir.getEPRUrl()) !== -1) && (request.url.indexOf('metadate') == -1 )) {
         console.log('Does token need refreshing '+ !this.oauth2.isAuthenticated());
         request = request.clone({
           setHeaders: {
             Authorization: `Bearer ${this.oauth2.getToken()}`
           }
         });
         return next.handle(request)
           .do((event: HttpEvent<any>) => {
               if (event instanceof HttpResponse) {
                 // do stuff with response if you want
               }
             }, (err: any) => {
               if (err instanceof HttpErrorResponse) {
                 if (err.status === 401) {
                   console.log('*** 401 401 401 401 401 ***')
                   // redirect to the login route
                   // or show a modal
                 }
               }
             });


       } else {
         return next.handle(request);
       }
  }
}
