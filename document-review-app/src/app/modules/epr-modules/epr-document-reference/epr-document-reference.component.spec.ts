import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprDocumentReferenceComponent } from './epr-document-reference.component';

describe('EprDocumentReferenceComponent', () => {
  let component: EprDocumentReferenceComponent;
  let fixture: ComponentFixture<EprDocumentReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprDocumentReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprDocumentReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
