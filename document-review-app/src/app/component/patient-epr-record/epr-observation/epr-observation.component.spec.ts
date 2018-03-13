import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprObservationComponent } from './epr-observation.component';

describe('EprObservationComponent', () => {
  let component: EprObservationComponent;
  let fixture: ComponentFixture<EprObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
