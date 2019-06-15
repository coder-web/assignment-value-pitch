import { Component, OnInit } from '@angular/core';
import { UserService } from './_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser } from './_models/IUser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  jwtHelper = new JwtHelperService();
  constructor(private userService: UserService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: IUser = JSON.parse(localStorage.getItem('user'));

    if (token)
      this.userService.decodedToken = this.jwtHelper.decodeToken(token)

    if (user) {
      this.userService.currentUser = user;
    }
  }

}
