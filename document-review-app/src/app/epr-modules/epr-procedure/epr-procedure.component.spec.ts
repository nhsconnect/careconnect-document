import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprProcedureComponent } from './epr-procedure.component';

describe('EprProcedureComponent', () => {
  let component: EprProcedureComponent;
  let fixture: ComponentFixture<EprProcedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprProcedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
