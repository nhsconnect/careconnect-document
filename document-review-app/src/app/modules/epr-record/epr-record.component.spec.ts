import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprRecordComponent } from './epr-record.component';

describe('EprRecordComponent', () => {
  let component: EprRecordComponent;
  let fixture: ComponentFixture<EprRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
