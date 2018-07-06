import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdmsRecordComponent } from './edms-record.component';

describe('EdmsRecordComponent', () => {
  let component: EdmsRecordComponent;
  let fixture: ComponentFixture<EdmsRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdmsRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
