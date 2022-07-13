import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, map, Observable, switchMap, take } from 'rxjs';
import { Location } from '../model/location';

88
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  apiUrl = environment.apiUrl;
  private _locations: BehaviorSubject<Location[] | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  get locations$(): Observable<Location[]>{
    return this._locations.asObservable();
  }


  _getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.apiUrl+'api/locations').pipe(
        map((data: Location[]) => {
          this._locations.next(data)
          return data
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }


  _addLocation(data: any): Observable<Location>{
    return this.locations$.pipe(
      take(1),
      switchMap(locations => this.http.post<Location>(this.apiUrl+'api/location/store', data).pipe(
          map((newLocation: Location) => {
              this._locations.next([newLocation,...locations]);
              return newLocation;
          })
      ))
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

  _deleteLocation(id): Observable<Location>{
    return this.locations$.pipe(
      take(1),
      switchMap(locations => this.http.delete<Location>(this.apiUrl+'api/location/delete/'+id).pipe(
          map((deletedLocations: any) => {
            const index = locations.findIndex(x=>x.id == id);
            locations.splice(index,1);
            this._locations.next(locations)
            return deletedLocations;
          })
      ))
    );
  }

  _updateLocations( datas: Location, $id: number,): Observable<Location>{
    return this.locations$.pipe(
      take(1),
      switchMap(locations => this.http.post<Location>(this.apiUrl+'api/location/update/'+$id, datas).pipe(
          map((updatedLocations: any) => {
            const locationIndex = locations.findIndex(d => d.id === updatedLocations.id);
            if(locationIndex > -1){
              locations.splice(locationIndex,1,updatedLocations);
            }
            this._locations.next(locations);
            return updatedLocations;
          })
      ))
    );
  }
}
