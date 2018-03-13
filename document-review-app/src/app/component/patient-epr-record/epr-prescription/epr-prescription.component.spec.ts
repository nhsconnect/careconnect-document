import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprPrescriptionComponent } from './epr-prescription.component';

describe('EprPrescriptionComponent', () => {
  let component: EprPrescriptionComponent;
  let fixture: ComponentFixture<EprPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
