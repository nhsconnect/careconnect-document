import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";


@Injectable()
export class ErrorsHandler implements ErrorHandler {

  constructor(
    // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
    private injector: Injector

  ) { }

  handleError(error: Error | HttpErrorResponse ) {
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      console.error('Http Error');
      if (!navigator.onLine) {
        // Handle offline error
      } else {
        // Handle Http Error (error.status === 403, 404...)
        if (error.status == 401) {
          console.log('Need to refresh access token');
          localStorage.removeItem("access_token");

        }
      }
    }
    //else if (error instanceof ExpressionChangedAfterItHasBeenCheckedError) {
    //}
    else {
      // Handle Client Error (Angular Error, ReferenceError...)
      console.error('It happens: ', error);
    }
    // Log the error anyway

  }
}
