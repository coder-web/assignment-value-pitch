import { TestBed } from '@angular/core/testing';

import { MisService } from './mis.service';

describe('MisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MisService = TestBed.get(MisService);
    expect(service).toBeTruthy();
  });
});
