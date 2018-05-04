import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSearchComponent } from './organisation-search.component';

describe('OrganisationSearchComponent', () => {
  let component: OrganisationSearchComponent;
  let fixture: ComponentFixture<OrganisationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
