import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdatePrioritiesComponent } from './add-or-update-priorities.component';

describe('AddOrUpdateLocationsComponent', () => {
  let component: AddOrUpdatePrioritiesComponent;
  let fixture: ComponentFixture<AddOrUpdatePrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdatePrioritiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdatePrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
