import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Status } from '../model/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

_addStatus(data: any): Observable<Status>{
    return this.http.post<Status>('https://opus.devtaktika.com/api/status/store', data).pipe(
        map((res: any) => res),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
  _getStatus(): Observable<Status>{
    return this.http.get<Status>('https://opus.devtaktika.com/api/statuses').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _getStatusById($id: any): Observable<Status>{
    return this.http.get<Status>('https://opus.devtaktika.com/api/status/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deleteStatus($id): Observable<Status>{
    return this.http.delete<Status>('https://opus.devtaktika.com/api/status/delete/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _updateStatus( datas: Status, $id: number,): Observable<Status>{
    return this.http.post<Status>('https://opus.devtaktika.com/api/status/update/'+$id, datas).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }
}
