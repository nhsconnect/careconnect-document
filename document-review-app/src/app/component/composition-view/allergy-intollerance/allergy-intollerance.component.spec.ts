import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergyIntolleranceComponent } from './allergy-intollerance.component';

describe('AllergyIntolleranceComponent', () => {
  let component: AllergyIntolleranceComponent;
  let fixture: ComponentFixture<AllergyIntolleranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllergyIntolleranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergyIntolleranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
