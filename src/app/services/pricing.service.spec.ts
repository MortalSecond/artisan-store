import { TestBed } from '@angular/core/testing';

import { PricingServiceService } from './pricing-service.service';

describe('PricingServiceService', () => {
  let service: PricingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
