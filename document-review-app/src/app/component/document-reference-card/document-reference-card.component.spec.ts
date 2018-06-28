import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReferenceCardComponent } from './document-reference-card.component';

describe('DocumentReferenceCardComponent', () => {
  let component: DocumentReferenceCardComponent;
  let fixture: ComponentFixture<DocumentReferenceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentReferenceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReferenceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
