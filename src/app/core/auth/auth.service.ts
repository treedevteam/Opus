import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError, tap, mapTo, shareReplay } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

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
        return this._httpClient.post('https://opus.devtaktika.com/api/user/password', credentials);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials): Observable<any>
    {


        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('https://opus.devtaktika.com/oauth/token', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return this._httpClient.get('https://opus.devtaktika.com/api/user').pipe(
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
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.get('https://opus.devtaktika.com/api/user').pipe(
            catchError(() =>
            // Return false
            of(false)
        ),
            switchMap((res:
                any)=>{
                localStorage.setItem('user_info', JSON.stringify(res.data));

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
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
         return this.signInUsingToken();
    }
}
