import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTaskRowComponent } from './store-task-row.component';

describe('StoreTaskRowComponent', () => {
  let component: StoreTaskRowComponent;
  let fixture: ComponentFixture<StoreTaskRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreTaskRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTaskRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
