import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprAllergyIntolleranceComponent } from './epr-allergy-intollerance.component';

describe('EprAllergyIntolleranceComponent', () => {
  let component: EprAllergyIntolleranceComponent;
  let fixture: ComponentFixture<EprAllergyIntolleranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprAllergyIntolleranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprAllergyIntolleranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
