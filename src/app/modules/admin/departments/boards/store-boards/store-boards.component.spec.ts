import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBoardsComponent } from './store-boards.component';

describe('StoreBoardsComponent', () => {
  let component: StoreBoardsComponent;
  let fixture: ComponentFixture<StoreBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
