import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprImmunisationComponent } from './epr-immunisation.component';

describe('EprImmunisationComponent', () => {
  let component: EprImmunisationComponent;
  let fixture: ComponentFixture<EprImmunisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprImmunisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprImmunisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
