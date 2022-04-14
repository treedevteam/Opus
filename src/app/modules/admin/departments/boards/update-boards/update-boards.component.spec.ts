import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBoardsComponent } from './update-boards.component';

describe('UpdateBoardsComponent', () => {
  let component: UpdateBoardsComponent;
  let fixture: ComponentFixture<UpdateBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
