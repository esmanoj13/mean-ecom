import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
export const tokenHTTPInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // Skip authentication for public endpoints
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/auth/reset-password')
  ) {
    return next(req);
  }

  let token: string | null = null;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      token = localStorage.getItem('token');
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }
  // If token is not present, log a warning and redirect to login
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('Unauthorized request:', error);
        localStorage.removeItem('token'); // Clear token on unauthorized access
        router.navigate(['/auth/login']); // Redirect to login
      }
      return throwError(() => error);
    })
  );
};
