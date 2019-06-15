import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { IMis } from '../_models/IMis';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { DataTablesResponse } from '../_models/DatatableResponse';

@Injectable({
  providedIn: 'root'
})
export class MisService {


  baseUrl = environment.baseUrl + 'mis/';

  constructor(private http: HttpClient) { }

  getData(_id: string, dataTablesParameters): Observable<DataTablesResponse> {
    const token = localStorage.getItem('token');
    return this.http.post<DataTablesResponse>(`${this.baseUrl}getrecords?id=${_id}&authToken=${token}`, dataTablesParameters);
  }
  saveData(model): Observable<any> {
    const token = localStorage.getItem('token');
    const params = new HttpParams()
      .set('name', model.name)
      .set('fname', model.fname)
      .set('address', model.address)
      .set('email', model.email)
      .set('mobile', model.mobile)
      .set('createdBy', model.createdBy)
      .set('authToken', token)

    return this.http.post(`${this.baseUrl}`, params)
      .pipe(catchError(e => this.handleError(e)));
  }
  deleteData(misId: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}${misId}?authToken=${token}`)
      .pipe(catchError(e => this.handleError(e)));
  }

  edit(model: IMis): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.baseUrl}${model.misId}?authToken=${token}`,model)
      .pipe(catchError(e => this.handleError(e)));
  }

  //exception handler
  private handleError(err: HttpErrorResponse) {
    return throwError(err.error);
  }
}
