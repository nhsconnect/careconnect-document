import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDocumentComponent } from './load-document.component';

describe('LoadDocumentComponent', () => {
  let component: LoadDocumentComponent;
  let fixture: ComponentFixture<LoadDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
