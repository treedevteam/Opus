import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { Location } from '../model/location';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

_addLocation(data: any): Observable<Location>{
    return this.http.post<Location>(this.apiUrl+'api/location/store', data).pipe(
        map((res: any) => res),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
  _getLocations(): Observable<Location>{
    return this.http.get<Location>(this.apiUrl+'api/locations').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _getLocationById($id: any): Observable<Location>{
    return this.http.get<Location>(this.apiUrl+'api/location/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deleteLocation($id): Observable<Location>{
    return this.http.delete<Location>(this.apiUrl+'api/location/delete/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _updateLocations( datas: Location, $id: number,): Observable<Location>{
    return this.http.post<Location>(this.apiUrl+'api/location/update/'+$id, datas).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }
}
