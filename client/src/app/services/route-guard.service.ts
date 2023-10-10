import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})

//Route-guard will decode token received from authService and return authorized user(role user or admin) or not
export class RouteGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token = localStorage.getItem('token');

    var tokenPayload: any;
    try {
      if (token) tokenPayload = jwt_decode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = '';

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] === tokenPayload.role) {
        expectedRole = tokenPayload.role;
      }
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && tokenPayload.role == expectedRole) {
        return true;
      }

      //token from storage not equal to user on authorizing or token invalid...
      this.snackbarService.openSnackBar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
