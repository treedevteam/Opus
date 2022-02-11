import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Priorities } from '../model/priorities';

@Injectable({
  providedIn: 'root'
})
export class PrioritiesService {

  constructor(private http: HttpClient) { }

_addPriority(data: any): Observable<Priorities>{
    return this.http.post<Priorities>('https://opus.devtaktika.com/api/priority/store', data).pipe(
        map((res: any) => res),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
  _getPriorities(): Observable<Priorities>{
    return this.http.get<Priorities>('https://opus.devtaktika.com/api/priorities').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _getPriorityById($id: any): Observable<Priorities>{
    return this.http.get<Priorities>('https://opus.devtaktika.com/api/priority/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deletePriority($id): Observable<Priorities>{
    return this.http.delete<Priorities>('https://opus.devtaktika.com/api/priority/delete/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _updatePriority( datas: Priorities, $id: number,): Observable<Priorities>{
    return this.http.post<Priorities>('https://opus.devtaktika.com/api/priority/update/'+$id, datas).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }
}
