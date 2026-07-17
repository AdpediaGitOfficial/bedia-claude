import { TestBed } from '@angular/core/testing';

import { CoursematerialService } from './coursematerial.service';

describe('CoursematerialService', () => {
  let service: CoursematerialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursematerialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
