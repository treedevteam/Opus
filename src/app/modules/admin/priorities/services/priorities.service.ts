import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, map, Observable, switchMap, take } from 'rxjs';
import { Priorities } from '../model/priorities';

@Injectable({
  providedIn: 'root'
})
export class PrioritiesService {
  apiUrl = environment.apiUrl;
  private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  get priorities$(): Observable<Priorities[]>{
    return this._priorities.asObservable();
  }

  _getPriorities(): Observable<Priorities[]>{
    return this.http.get<Priorities[]>(this.apiUrl+'api/priorities').pipe(
        map((data: any) => {
          this._priorities.next(data)
          return data 
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _addPriority(data: any): Observable<Priorities>{
    return this.priorities$.pipe(
      take(1),
      switchMap(priorities => this.http.post<Priorities>(this.apiUrl+'api/priority/store', data).pipe(
          map((newpriority: Priorities) => {
              this._priorities.next([newpriority,...priorities]);
              return newpriority;
          })
      ))
    );
  }

  _getPriorityById($id: any): Observable<Priorities>{
    return this.http.get<Priorities>(this.apiUrl+'api/priority/'+$id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
  }

  _deletePriority($id): Observable<Priorities>{
    return this.priorities$.pipe(
      take(1),
      switchMap(priorities => this.http.delete<Priorities>(this.apiUrl+'api/priority/delete/'+$id).pipe(
          map((newpriority: Priorities) => {
              const index = priorities.findIndex(x=>x.id === $id);
              priorities.splice(index,1)
              this._priorities.next(priorities);
              return newpriority;
          })
      ))
    );
  }

  _updatePriority( datas: Priorities, $id: number,): Observable<Priorities>{
    return this.priorities$.pipe(
      take(1),
      switchMap(priorities => this.http.post<Priorities>(this.apiUrl+'api/status/update/'+$id, datas).pipe(
          map((updatedPriority: Priorities) => {
            const priorityIndex = priorities.findIndex(d => d.id === updatedPriority.id);
            if(priorityIndex > -1){
              priorities.splice(priorityIndex,1,updatedPriority);
            }
            this._priorities.next(priorities);
            return updatedPriority;
          })
      ))
    );
  }
}
