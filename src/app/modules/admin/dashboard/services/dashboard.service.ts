/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.apiUrl; 
  constructor(private _http:HttpClient) { }


  //Returns userCount
  getUserCount()
  {
    return  this._http.get(this.apiUrl +'api/data');
  }
}
