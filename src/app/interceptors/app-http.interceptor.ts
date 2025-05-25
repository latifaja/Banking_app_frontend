import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class AppHttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/auth/login')) {
      return next.handle(request);
    } else {
      let newRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer '+this.authService.accessToken)
      });
      return next.handle(newRequest).pipe(
        catchError(err => {
          if (err.status == 401) {
            this.authService.logout();
          }
          throw err;
        })
      );
    }
  }
}

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};