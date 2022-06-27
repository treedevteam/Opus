import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignUsersToBoardComponent } from './asign-users-to-board.component';

describe('AsignUsersToBoardComponent', () => {
  let component: AsignUsersToBoardComponent;
  let fixture: ComponentFixture<AsignUsersToBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignUsersToBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignUsersToBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
