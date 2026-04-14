import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';
// import { JwtService } from '../services/jwt.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//     constructor(private jwtService: JwtService) { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = this.jwtService.getToken();
//         if (token) {
          
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//         }
//         return next.handle(req).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 return throwError(error);
//             })
//         );
//     }
// }
//the purpose of TokenInterceptor is to attach the Token to HTTP outgoing requests 
//if the user is Authenticated (THE TOKEN EXISTS) it clones the request and adds the Authorization header with Bearer ${token