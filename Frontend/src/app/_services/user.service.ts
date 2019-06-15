import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUser } from '../_models/IUser';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  jwtHelper = new JwtHelperService();
  baseUrl = environment.baseUrl + 'users/';
  decodedToken: any;

  public currentUser: IUser;

  constructor(private http: HttpClient) {
  }

  register(userData): Observable<any>{
    const params = new HttpParams()
    .set('name', userData.name)
    .set('email', userData.email)
    .set('password', userData.password)
    return this.http.post(`${this.baseUrl}signup`, params)
    .pipe(catchError(e => this.handleError(e)));;
  };

  login(userData): Observable<any>{
    const params = new HttpParams()
    .set('email', userData.email)
    .set('password', userData.password)
    return this.http.post(`${this.baseUrl}login`, params)
    .pipe(catchError(e => this.handleError(e)));
  };

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  
  //exception handler
  private handleError(err: HttpErrorResponse) {
    return throwError(err.error);
  }
}
