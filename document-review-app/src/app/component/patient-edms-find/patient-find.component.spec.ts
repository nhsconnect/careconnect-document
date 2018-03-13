import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFindComponent } from './patient-find.component';

describe('PatientFindComponent', () => {
  let component: PatientFindComponent;
  let fixture: ComponentFixture<PatientFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
