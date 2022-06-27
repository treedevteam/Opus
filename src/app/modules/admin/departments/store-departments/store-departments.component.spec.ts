import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDepartmentsComponent } from './store-departments.component';

describe('StoreDepartmentsComponent', () => {
  let component: StoreDepartmentsComponent;
  let fixture: ComponentFixture<StoreDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
