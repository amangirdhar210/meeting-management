// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { LoginService } from '../shared/services/login.service';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(LoginService);
//   const router = inject(Router);

//   if (auth.isLoggedIn()) {
//     return true;
//   } else {
//     alert('Please log in first!');
//     router.navigate(['/login']);
//     return false;
//   }
// };

// src/app/shared/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(LoginService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  } else {
    alert('Please log in first!');
    router.navigate(['/login']);
    return false;
  }
};
