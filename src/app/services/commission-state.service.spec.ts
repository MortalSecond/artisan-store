import { TestBed } from '@angular/core/testing';

import { CommissionStateService } from './commission-state.service';

describe('CommissionStateService', () => {
  let service: CommissionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
