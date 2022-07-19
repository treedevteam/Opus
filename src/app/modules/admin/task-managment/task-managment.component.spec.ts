import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagmentComponent } from './task-managment.component';

describe('TaskManagmentComponent', () => {
  let component: TaskManagmentComponent;
  let fixture: ComponentFixture<TaskManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskManagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
