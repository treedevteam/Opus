import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateLocationsComponent } from './add-or-update-locations.component';

describe('AddOrUpdateLocationsComponent', () => {
  let component: AddOrUpdateLocationsComponent;
  let fixture: ComponentFixture<AddOrUpdateLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdateLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdateLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
