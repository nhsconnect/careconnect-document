import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprPatientComponent } from './epr-patient.component';

describe('EprPatientComponent', () => {
  let component: EprPatientComponent;
  let fixture: ComponentFixture<EprPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
