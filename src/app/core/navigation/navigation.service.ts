import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
export interface Boards{
    id: number;
    department_id: string;
    name: string;
    description: string;
    type: any;
    is_his: number;
}
@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    apiUrl = environment.apiUrl
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _boards: ReplaySubject<Boards[]> = new ReplaySubject<Boards[]>(1);

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
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    get myboards$(): Observable<Boards[]>
    {
        return this._boards.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }


    getmyBoards(): Observable<any[]>
    {
        return this._httpClient.get(this.apiUrl+'api/user/boards/all').pipe(
            tap((navigation:any): any[] => {
                
                this._boards.next(navigation.public);
                return navigation.public;
            })
        );
    }
}
