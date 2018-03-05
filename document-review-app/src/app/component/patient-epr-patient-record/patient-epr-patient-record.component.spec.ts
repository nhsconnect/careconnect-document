import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEprPatientRecordComponent } from './patient-epr-patient-record.component';

describe('PatientEprPatientRecordComponent', () => {
  let component: PatientEprPatientRecordComponent;
  let fixture: ComponentFixture<PatientEprPatientRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientEprPatientRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEprPatientRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
