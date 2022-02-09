import { TestBed } from '@angular/core/testing';

import { DepartamentsService } from './departaments.service';

describe('DepartamentsService', () => {
  let service: DepartamentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
