import { HttpInterceptorFn } from '@angular/common/http';

export const tokenHTTPInterceptor: HttpInterceptorFn = (req, next) => {
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
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(modifiedReq);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }

  // Only log token missing for protected endpoints
  if (req.url.includes('/customer/') || req.url.includes('/admin/')) {
    console.warn('Protected endpoint accessed without authentication token');
  }
  return next(req);
};
