import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksLogsComponent } from './tasks-logs.component';

describe('TasksLogsComponent', () => {
  let component: TasksLogsComponent;
  let fixture: ComponentFixture<TasksLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
