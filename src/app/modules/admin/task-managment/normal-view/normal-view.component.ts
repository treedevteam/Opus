import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-normal-view',
  templateUrl: './normal-view.component.html',
  styleUrls: ['./normal-view.component.scss']
})
export class NormalViewComponent implements OnInit {
  drawerMode: 'side' | 'over';
  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,

  ) { }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    // Subscribe to media query change
    this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((state) => {

        // Calculate the drawer mode
        this.drawerMode = state.matches ? 'side' : 'over';

        // Mark for check
        this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  onBackdropClicked(): void
  {
      // Go back to the list
      this._router.navigate(['./'], {relativeTo: this._activatedRoute});

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

}
