import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskRowComponent } from './subtask-row.component';

describe('SubtaskRowComponent', () => {
  let component: SubtaskRowComponent;
  let fixture: ComponentFixture<SubtaskRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtaskRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
