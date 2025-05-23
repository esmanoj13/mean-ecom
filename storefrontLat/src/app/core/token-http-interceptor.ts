import { HttpInterceptorFn } from '@angular/common/http';

export const tokenHTTPInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  try {
    token = localStorage.getItem('token');
    console.log('Retrieved Token:', token);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Modified Request:', modifiedReq);
    return next(modifiedReq);
  }

  console.log('No token found, sending request without Authorization header.');
  return next(req);
};
