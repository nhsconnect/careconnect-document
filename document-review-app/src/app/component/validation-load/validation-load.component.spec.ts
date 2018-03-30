import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationLoadComponent } from './validation-load.component';

describe('ValidationLoadComponent', () => {
  let component: ValidationLoadComponent;
  let fixture: ComponentFixture<ValidationLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
