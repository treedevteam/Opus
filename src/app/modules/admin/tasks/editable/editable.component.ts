import { Component, ContentChild, HostListener, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { NgControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, filter, take, switchMapTo } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'editable',
  template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
    <a [routerLink]="" #editbutton class="editbutton">edit</a>
  `,
  styleUrls: ['./editable.component.css']
})
export class EditableComponent implements AfterViewInit{
  @ContentChild(ViewModeDirective) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl: EditModeDirective;
  @Output() update = new EventEmitter();
  @ViewChild('editbutton', { static: false }) myButton: ElementRef;

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  mode: 'view' | 'edit' = 'view';
  // relevantElem: HTMLElement = document.querySelector(`.testttt`) as HTMLElement;


  constructor(private host: ElementRef) {
  }
  ngAfterViewInit(): void {
    this.viewModeHandler();
    this.editModeHandler();
  }

  ngOnInit() {

  }

  toViewMode() {
    this.update.next(true);
    this.mode = 'view';
  }

  private get element() {
    return this.host.nativeElement;
  }

  private get elementedit() {
    return this.myButton.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.elementedit, 'click').pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.mode = 'edit';
      this.editMode.next(true);
    });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
    );



    this.editMode$.pipe(
      switchMapTo(clickOutside$),
      untilDestroyed(this)
    ).subscribe(event => this.toViewMode());
  }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {
  }

}
