import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable, BehaviorSubject, take, switchMap } from 'rxjs';
import { Status } from '../model/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  apiUrl = environment.apiUrl;
  private _statuses: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }
  get statuses$(): Observable<Status[]>
  {
      return this._statuses.asObservable();
  }
  getStatuses(): Observable<Status[]>{
      return this.http.get<Status[]>(this.apiUrl+'api/statuses').pipe(
          map((data: any) => {
            this._statuses.next(data)
            return data
          }),
        catchError((err) => {
          console.error(err);
          throw err;
        }
      )
      );
    }

    _addStatus(data: any): Observable<Status>{
        return this.statuses$.pipe(
          take(1),
          switchMap(statuses => this.http.post<Status>(this.apiUrl+'api/status/store', data).pipe(
              map((newStatus: Status) => {
                  this._statuses.next([newStatus,...statuses]);
                  return newStatus;
              })
          ))
        );
    }

  _getStatusById($id: any): Observable<Status>{
    return this.http.get<Status>(this.apiUrl+'api/status/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deleteStatus($id): Observable<Status>{
    return this.statuses$.pipe(
      take(1),
      switchMap(statuses => this.http.delete<Status>(this.apiUrl+'api/status/delete/'+ $id).pipe(
          map((deletedStatus: any) => {
            const index = statuses.findIndex(x=>x.id == $id);
            statuses.splice(index,1);
            this._statuses.next(statuses)
            return deletedStatus;
          })
      ))
    );
  }

  _updateStatus( datas: Status, $id: number,): Observable<Status>{
    return this.statuses$.pipe(
      take(1),
      switchMap(statuses => this.http.post<Status>(this.apiUrl+'api/status/update/'+$id, datas).pipe(
          map((updatedStatus: Status) => {
            const statusIndex = statuses.findIndex(d => d.id === updatedStatus.id);
            if(statusIndex > -1){
              statuses.splice(statusIndex,1,updatedStatus);
            }
            this._statuses.next(statuses);
            return updatedStatus;
          })
      ))
    );
  }

}
