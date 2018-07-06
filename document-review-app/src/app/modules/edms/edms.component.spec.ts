import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdmsComponent } from './edms.component';

describe('EdmsComponent', () => {
  let component: EdmsComponent;
  let fixture: ComponentFixture<EdmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
