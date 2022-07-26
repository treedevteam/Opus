import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistKanbanLayoutComponent } from './tasklist-kanban-layout.component';

describe('TasklistKanbanLayoutComponent', () => {
  let component: TasklistKanbanLayoutComponent;
  let fixture: ComponentFixture<TasklistKanbanLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasklistKanbanLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistKanbanLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
