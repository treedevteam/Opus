import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateStatusComponent } from './add-or-update-status.component';

describe('AddOrUpdateLocationsComponent', () => {
  let component: AddOrUpdateStatusComponent;
  let fixture: ComponentFixture<AddOrUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdateStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
