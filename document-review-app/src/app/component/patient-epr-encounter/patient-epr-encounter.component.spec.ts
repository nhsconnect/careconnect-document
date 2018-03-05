import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEprEncounterComponent } from './patient-epr-encounter.component';

describe('PatientEprEncounterComponent', () => {
  let component: PatientEprEncounterComponent;
  let fixture: ComponentFixture<PatientEprEncounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientEprEncounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEprEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
