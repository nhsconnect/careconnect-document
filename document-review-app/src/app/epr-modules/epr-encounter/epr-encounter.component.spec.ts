import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprEncounterComponent } from './epr-encounter.component';

describe('EprEncounterComponent', () => {
  let component: EprEncounterComponent;
  let fixture: ComponentFixture<EprEncounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprEncounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
