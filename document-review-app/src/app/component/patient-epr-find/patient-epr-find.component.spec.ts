import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEprFindComponent } from './patient-epr-find.component';

describe('PatientEprFindComponent', () => {
  let component: PatientEprFindComponent;
  let fixture: ComponentFixture<PatientEprFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientEprFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEprFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
