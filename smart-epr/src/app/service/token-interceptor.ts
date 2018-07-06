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
import { Observable } from 'rxjs';
import { tap} from 'rxjs/operators';
import {FhirService} from "./fhir.service";
import {AuthService} from "./auth.service";



@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private oauth2 : Oauth2Service, public fhir : FhirService, public authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // FHIR resource requests only
       if ((request.url.indexOf(this.fhir.getEPRUrl()) !== -1) && (request.url.indexOf('metadate') == -1 )) {
         console.log('Does token need refreshing ' + !this.oauth2.isAuthenticated());
         if (request.method == "PUT" || request.method == "POST") {
           request = request.clone({
             setHeaders: {
               Authorization: `Bearer ${this.oauth2.getToken()}`,
               Prefer : 'return=representation'
             }
           });
         } else {
           request = request.clone({
             setHeaders: {
               Authorization: `Bearer ${this.oauth2.getToken()}`
             }
           });
         }
         return next.handle(request).pipe(
           tap((event: HttpEvent<any>) => {
               if (event instanceof HttpResponse) {
                 // do stuff with response if you want
               }
             }, (err: any) => {
               if (err instanceof HttpErrorResponse) {
                 console.log("Interceptor error");
                 if (err.status === 401) {
                   console.log('*** 401 401 401 401 401 ***');
                   if (this.authService.getAccessToken() != undefined) {
                     console.log('Removing access token and reauthorising');
                     localStorage.removeItem('access_token')
                     this.fhir.authoriseOAuth2();
                   } else {
                     console.log('No token found. Try logout?');
                   }

                 }
               }
             })
         )

       } else {
         return next.handle(request);
       }
  }
}
