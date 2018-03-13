import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDocumentFileComponent } from './load-document-file.component';

describe('LoadDocumentFileComponent', () => {
  let component: LoadDocumentFileComponent;
  let fixture: ComponentFixture<LoadDocumentFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDocumentFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDocumentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
