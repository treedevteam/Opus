import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanSubtaskCardComponent } from './kanban-subtask-card.component';

describe('KanbanSubtaskCardComponent', () => {
  let component: KanbanSubtaskCardComponent;
  let fixture: ComponentFixture<KanbanSubtaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanSubtaskCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanSubtaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
