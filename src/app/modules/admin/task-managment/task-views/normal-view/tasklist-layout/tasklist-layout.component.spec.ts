import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistLayoutComponent } from './tasklist-layout.component';

describe('TasklistLayoutComponent', () => {
  let component: TasklistLayoutComponent;
  let fixture: ComponentFixture<TasklistLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasklistLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
