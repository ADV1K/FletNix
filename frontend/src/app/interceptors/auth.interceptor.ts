import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage (cookie is httpOnly and can't be read by JS)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  } else {
    req = req.clone({
      withCredentials: true,
    });
  }

  return next(req);
};

