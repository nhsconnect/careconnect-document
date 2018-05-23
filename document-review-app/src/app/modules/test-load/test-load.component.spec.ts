import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLoadComponent } from './test-load.component';

describe('TestLoadComponent', () => {
  let component: TestLoadComponent;
  let fixture: ComponentFixture<TestLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
