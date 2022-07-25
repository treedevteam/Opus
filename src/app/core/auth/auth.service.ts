import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError, tap, mapTo, shareReplay, map, BehaviorSubject } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../environments/environment';
import { Role } from './roles';
import { User } from '../user/user.types';

@Injectable()
export class AuthService
{
    private apiUrl = environment.apiUrl;

    private _authenticated: boolean = false;
    private _userRole: BehaviorSubject<boolean | null> = new BehaviorSubject(null); 

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    get accessToken(): string
    {


        return localStorage.getItem('access_token') ?? '';
    }
    set accessToken(token: string)
    {

        localStorage.setItem('access_token', token);
    }

    get getRole$(): Observable<boolean>
    {
        return this._userRole.asObservable();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    changepassword(credentials: { current_password: string; new_password: string; new_confirm_password: string }): Observable<any>
    {
        return this._httpClient.post(this.apiUrl+'api/user/password', credentials);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials): Observable<any>
    {

        debugger;
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.apiUrl+'oauth/token', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return this._httpClient.get(this.apiUrl+'api/user').pipe(
                    catchError(() =>
                    // Return false
                    of(false)
                ),
                    switchMap((res:
                        any)=>{
                        localStorage.setItem('user_info', JSON.stringify(res.data));
                        return of(response);
                    })
                );
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<boolean>
    {
        // Renew token
        return this._httpClient.get(this.apiUrl+'api/user').pipe(
            catchError(() =>
            // Return false
            of(false)
        ),
            switchMap((res: any)=>{
                localStorage.setItem('user_info', JSON.stringify(res.data));
                this._userService.user = res.data;
                return of(true);
            }),shareReplay(1),
        );
        }

    /**
     * Sign out
     */
     signOut(): any
     {
        // Remove the access token from the local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        // Set the authenticated flag to false
        this._authenticated = false;

     }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {

        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {

        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }
        // Check the access token expire date
        return of(!AuthUtils.isTokenExpired(this.accessToken));
    }



    isAdmin(): any{
        return this._userService.user$.pipe(
            map((res: User): any => {
                console.log(res,"RESSSSSSSSTEST");
                this._userRole.next(res.role.name === Role.Admin)
                return of(res.role.name === Role.Admin)
            }),

        );
    }
}
