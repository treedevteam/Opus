import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDepartmentsComponent } from './update-departments.component';

describe('UpdateDepartmentsComponent', () => {
  let component: UpdateDepartmentsComponent;
  let fixture: ComponentFixture<UpdateDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
