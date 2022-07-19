import { TestBed } from '@angular/core/testing';

import { TaskManagmentResolver } from './task-managment.resolver';

describe('TaskManagmentResolver', () => {
  let resolver: TaskManagmentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TaskManagmentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
