import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerSearchComponent } from './practitioner-search.component';

describe('PractitionerSearchComponent', () => {
  let component: PractitionerSearchComponent;
  let fixture: ComponentFixture<PractitionerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
