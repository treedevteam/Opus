import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Role } from 'app/core/auth/roles';
import { FuseNavigationItem } from '../../../../../@fuse/components/navigation/navigation.types';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    apiUrl = environment.apiUrl;

    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    user: User;
    userInfo: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _authservice: AuthService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userLoginInfo();
        this._navigationService.getmyBoards().subscribe();
        // Subscribe to navigation data
        combineLatest(this._navigationService.navigation$, this._userService.user$,this._navigationService.myboards$)
        .subscribe(([navigation, user, boards])=>{
            console.log(navigation,user);

            if(user.role.name === Role.Admin){
                this.navigation = navigation.default.filter(x=> x.admin === true)
            }else{

                // const departmetn = {
                //     id   : 'Department',
                //     title: 'Department',
                //     type : 'basic',
                //     icon : 'heroicons_outline:view-grid-add',
                //     link : '/departments',
                //     admin: false,
                // }
                
                const myBoards = boards.map(x=>
                    (
                        {
                            id   : 'Boards',
                            title: x.name,
                            type : 'basic',
                            link : '/board/'+ x.id+'/tasks',
                            admin: false,
                        }
                    )
                )
              this.navigation = [...navigation.default.filter(x=> x.admin === false),...myBoards]
            }
        })
        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        this.userLoginInfo();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    userLoginInfo(): void{
        this.userInfo = JSON.parse(localStorage.getItem('user_info') ?? '');
        console.log(this.userInfo);
    }
}
