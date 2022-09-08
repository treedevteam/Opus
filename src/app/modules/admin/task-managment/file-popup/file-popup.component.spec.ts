import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePopupComponent } from './file-popup.component';

describe('FilePopupComponent', () => {
  let component: FilePopupComponent;
  let fixture: ComponentFixture<FilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
