import { TestBed, inject } from '@angular/core/testing';

import { PatientChangeService } from './epr.service';

describe('PatientChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientChangeService]
    });
  });

  it('should be created', inject([PatientChangeService], (service: PatientChangeService) => {
    expect(service).toBeTruthy();
  }));
});
