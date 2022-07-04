import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrumboardCardDetailsComponent } from './details/details.component';

@Component({
    selector       : 'scrumboard-card',
    templateUrl    : './card.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrumboardCardComponent implements OnInit
{
    sub: any;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.sub = this.route
        .data
        .subscribe((v) => {
            console.log(v.some_data);

            this._matDialog.open(ScrumboardCardDetailsComponent, {data:v.some_data, autoFocus: false})
            .afterClosed()
            .subscribe(() => {

                // Go up twice because card routes are setup like this; "card/CARD_ID"
                this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
        });

        // Launch the modal

    }
}
