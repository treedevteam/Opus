/* eslint-disable */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    apiUrl = environment.apiUrl
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    public _user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
     get user$(): Observable<User>
     {
         return this._user.asObservable();
     }
    get singleUser$(): Observable<User>
    {
        return this._user$.asObservable();
    }

    set user(value: User)
    {
        console.log(value,"USERRRR");
        
        // Store the value
        this._user.next(value);
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get(this.apiUrl + 'api/user').pipe(
            tap((user:any) => {
                this._user.next(user.data);
                this._user$.next(user.data);

            }),
            shareReplay(1)
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.get(this.apiUrl + 'api/user').pipe(
            tap((user:any) => {
                this._user.next(user.data);
            })
        );
    }

    _updateSingleUser($id: number, data: any): Observable<User>{
        debugger
        return this.user$.pipe(
            take(1),
          switchMap((users) => this._httpClient.post<User> (this.apiUrl+'api/user/update/' + $id, data).pipe(
              map((updatedUsers) => {
                this._user.next(users);
                this._user$.next(users);
                return updatedUsers;
              })
          ))
        );
      }

      updatee(id,data):Observable<User>{
        return this._httpClient.post<User>(this.apiUrl+'api/user/update/'+id,data).pipe(
            tap((user:any) => {
                this._user$.next(user)
            }))
      }
}
