import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionReferencesModalComponent } from './section-references-modal.component';

describe('SectionReferencesModalComponent', () => {
  let component: SectionReferencesModalComponent;
  let fixture: ComponentFixture<SectionReferencesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionReferencesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionReferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
