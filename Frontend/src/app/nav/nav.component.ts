import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser } from './../_models/IUser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:IUser;
  
  constructor(private router: Router, private spinner:NgxSpinnerService, public userService: UserService,private toastr: ToastrService) {
  }

  ngOnInit() {
    this.model={
      name:'',
      email:'',
      password:''
    }
  }

  login = () =>{
    const userData = {
      name: this.model.name,
      email: this.model.email,
      password: this.model.password
    }
    this.openSpinner();

    this.userService.login(userData).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.info(apiResponse.message);
        this.model = { email: '', name: '', password: '' };
        localStorage.setItem('token', apiResponse.data.token);
        localStorage.setItem('user', JSON.stringify(apiResponse.data));
        // this.userService.decodedToken = this.jwtHelper.decodeToken(user.token);
        this.userService.currentUser = apiResponse.data;

        this.router.navigate(['/dashboard']);
      }
      else
        this.toastr.error(apiResponse.message);
    }, (error) => {
      this.toastr.error(error.message);
    },()=>{
      this.openSpinner(false);
    })
  }
  openSpinner = (isLoading: boolean = true) => {
    isLoading ? this.spinner.show() : this.spinner.hide();
  };//end of openSpinner function

  loggedIn() {
    return this.userService.loggedIn();
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userService.decodedToken = null;
    this.userService.currentUser = null;
    this.toastr.info("logged out");
    this.router.navigate(['/signup'])
  }
}
