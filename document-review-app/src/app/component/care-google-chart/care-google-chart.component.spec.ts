import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareGoogleChartComponent } from './care-google-chart.component';

describe('CareGoogleChartComponent', () => {
  let component: CareGoogleChartComponent;
  let fixture: ComponentFixture<CareGoogleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareGoogleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareGoogleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
