import { TestBed, inject } from '@angular/core/testing';

import { BundleService } from './bundle.service';

describe('BundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BundleService]
    });
  });

  it('should be created', inject([BundleService], (service: BundleService) => {
    expect(service).toBeTruthy();
  }));
});
