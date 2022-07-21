import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenimageTaskComponent } from './openimage-task.component';

describe('OpenimageTaskComponent', () => {
  let component: OpenimageTaskComponent;
  let fixture: ComponentFixture<OpenimageTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenimageTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenimageTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
