import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IUser } from '../_models/IUser';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private userService: UserService, private toastr: ToastrService) { }

  model: IUser;

  ngOnInit() {
    if (this.userService.loggedIn()) this.router.navigate(['dashboard']);
    this.model = {
      name: '', password: '', email: ''
    }
  }

  signUp = () => {

    const userData = {
      name: this.model.name,
      email: this.model.email,
      password: this.model.password
    }
    this.openSpinner();
    this.userService.register(userData).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success(apiResponse.message);
        this.model = { email: '', name: '', password: '' };
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
}
