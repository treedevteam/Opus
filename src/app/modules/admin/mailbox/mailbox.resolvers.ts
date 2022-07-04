import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, finalize, forkJoin, Observable, throwError } from 'rxjs';
import { MailboxService } from 'app/modules/admin/mailbox/mailbox.service';
import { Mail, MailFilter, MailFolder, MailLabel } from 'app/modules/admin/mailbox/mailbox.types';

@Injectable({
    providedIn: 'root'
})
export class MailboxFoldersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: MailboxService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailFolder[]>
    {
        return this._mailboxService.getFolders();
    }
}

@Injectable({
    providedIn: 'root'
})
export class MailboxFiltersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: MailboxService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailFilter[]>
    {
        return this._mailboxService.getFilters();
    }
}

@Injectable({
    providedIn: 'root'
})
export class MailboxLabelsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mailboxService: MailboxService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MailLabel[]>
    {
        return this._mailboxService.getLabels();
    }
}

@Injectable({
    providedIn: 'root'
})
export class MailboxMailsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _mailboxService: MailboxService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mail[]> | any
    {
        // Don't allow page param to go below 1
        if ( route.paramMap.get('page') && parseInt(route.paramMap.get('page'), 10) <= 0 )
        {
            // Get the parent url
            const url = state.url.split('/').slice(0, -1).join('/') + '/1';

            // Navigate to there
            this._router.navigateByUrl(url);

            // Don't allow request to go through
            return false;
        }

        // Create and build the sources array
        const sources = [];

        // If folder is set on the parameters...
        if ( route.paramMap.get('folder') )
        {
            sources.push(this._mailboxService.getEmails().subscribe());
        }

        // Fork join all the sources
    }
}

@Injectable({
    providedIn: 'root'
})
export class MailboxMailResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _mailboxService: MailboxService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mail>
    {
        return this._mailboxService.getMailById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested mail is either
                       // not available on the requested page or not
                       // available at all
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}
