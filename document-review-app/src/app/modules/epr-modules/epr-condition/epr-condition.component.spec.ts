import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EprConditionComponent } from './epr-condition.component';

describe('EprConditionComponent', () => {
  let component: EprConditionComponent;
  let fixture: ComponentFixture<EprConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EprConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EprConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
