import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTaskDialogComponent } from './join-task-dialog.component';

describe('JoinTaskDialogComponent', () => {
  let component: JoinTaskDialogComponent;
  let fixture: ComponentFixture<JoinTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinTaskDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
