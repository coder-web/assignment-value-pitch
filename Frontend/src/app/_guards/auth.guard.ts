import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService,
    private router: Router,
    private alertify: ToastrService) { }
  canActivate(): boolean {
    if (this.userService.loggedIn()) {
      return true;
    }
    this.alertify.error('You are not authorized!!!');
    this.router.navigate(['/signup']);
    return false;
  }
}
