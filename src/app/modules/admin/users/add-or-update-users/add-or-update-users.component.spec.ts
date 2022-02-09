import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateUsersComponent } from './add-or-update-users.component';

describe('AddOrUpdateUsersComponent', () => {
  let component: AddOrUpdateUsersComponent;
  let fixture: ComponentFixture<AddOrUpdateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdateUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
