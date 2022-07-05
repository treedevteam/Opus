import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreReplyComponent } from './store-reply.component';

describe('StoreReplyComponent', () => {
  let component: StoreReplyComponent;
  let fixture: ComponentFixture<StoreReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
