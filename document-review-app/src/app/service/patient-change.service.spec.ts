import { TestBed, inject } from '@angular/core/testing';

import { PatientChangeService } from './patient-change.service';

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
