/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/semi */
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
    userInfo = this._userService._user$
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
        console.warn(this._userService._user$)
        // this.userLoginInfo();
        this._navigationService.getmyBoards().subscribe();
        this._navigationService.getPrivateBoards().subscribe()
        // Subscribe to navigation data
        combineLatest(this._navigationService.navigation$, this._userService.user$,this._navigationService.myboards$, this._navigationService.privateBoards$)
        .subscribe(([navigation, user, boards,privateBoards])=>{
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
                        console.log(x),
                        {
                            id   : 'Boards',
                            title: x.name,
                            type : 'basic',
                            link : '/task-managment/'+x.id+'/view/normal',
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
        // this.userLoginInfo();
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


    wcHexIsLight(color: any): string {
        const hex = color.replace('#', '');
        const cr = parseInt(hex.substr(0, 2), 16);
        const cg = parseInt(hex.substr(2, 2), 16);
        const cb = parseInt(hex.substr(4, 2), 16);
        const brightness = ((cr * 299) + (cg * 587) + (cb * 114)) / 1000;
        if(brightness < 155){
            return 'text-on-primary';
        }else{
            return 'text-on-dark';
        }
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

    // userLoginInfo(): void{

    //     this.userInfo = JSON.parse(localStorage.getItem('user_info') ?? '');
    //     console.log(this.userInfo);
    // }
}
