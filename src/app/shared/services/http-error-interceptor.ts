import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CustomSnackbarService } from './custom-snackbar.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private customSnackBar: CustomSnackbarService){

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        let errorMessage = '';
        if (error instanceof HttpErrorResponse) {
           // server-side error
           errorMessage = `${error.error.message}, \n Error Code: ${error.status}`;
           this.customSnackBar.open(errorMessage, 'Error');

        } else {
          // client-side error
          errorMessage = `Something went wrong, Error Code: ${error.error.message}`;
          this.customSnackBar.open(errorMessage, 'Error');
        }
        return throwError(error);
      })
    );
  }
}
