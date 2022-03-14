import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, BehaviorSubject } from 'rxjs';
import { Status } from '../model/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private addedStatus = new BehaviorSubject<Status>(null);
  private updateStatus = new BehaviorSubject<Status>(null);
  private deletedStatus = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) { }
  getStatuses$ = this.http.get<Status[]>('http://127.0.0.1:8000/api/statuses').pipe(
    map((data: any) :Status[] => data),
   catchError((err) => {
     console.error(err);
     throw err;
   }
 )
);

get addedStatus$(): Observable<Status>
{
    return this.addedStatus.asObservable();
}

get updatedStatus$(): Observable<Status>
{
    return this.updateStatus.asObservable();
}

get deletedStatus$(): Observable<number>
{
    return this.deletedStatus.asObservable();
}

_addStatus(data: any): Observable<Status>{
    return this.http.post<Status>('http://127.0.0.1:8000/api/status/store', data).pipe(
        map((res: any) => {
          this.resetObserv();
          this.addedStatus.next(res);
          return res;
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
  _getStatus(): Observable<Status>{
    return this.http.get<Status>('http://127.0.0.1:8000/api/statuses').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _getStatusById($id: any): Observable<Status>{
    return this.http.get<Status>('http://127.0.0.1:8000/api/status/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deleteStatus($id): Observable<Status>{
    return this.http.delete<Status>('http://127.0.0.1:8000/api/status/delete/'+$id).pipe(
        map((data: any) => {
          this.resetObserv();
          this.deletedStatus.next($id);
          return data;
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _updateStatus( datas: Status, $id: number,): Observable<Status>{
    return this.http.post<Status>('http://127.0.0.1:8000/api/status/update/'+$id, datas).pipe(
        map((data: any) => {
          this.resetObserv();
          this.updateStatus.next(data);
          return data;
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  resetObserv(): any{
    this.addedStatus.next(null);
    this.updateStatus.next(null);
    this.deletedStatus.next(null);
}
}
