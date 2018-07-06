/// <reference path="../../../../node_modules/@types/fhir/index.d.ts" />

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChartOptions} from '../care-google-chart/chart-options';
import {ChartOptionsAxis} from '../care-google-chart/chart-options-axis';
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-observation-detail',
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.css']
})
export class ObservationDetailComponent implements OnInit {
  patient: fhir.Patient;

  observations : Array<fhir.Observation>;

  @Input() patientId : number;

  @Input() code : string;

  @Input() divId : string;

  public obs_ChartData : any[] ;

  public obs_ChartOptions:ChartOptions ;


  constructor(    private route: ActivatedRoute,
                  private fhirService: FhirService,
                 ) { }

  ngOnInit() {

    this.getObservations();
  }



  getObservations(): void {

    let tempChartOptions = new ChartOptions();
    let tempChartData  = new Array();
    console.log("Width = "+(window.screen.width));
    tempChartOptions.width = 450;
    if ((window.screen.width) < 450) tempChartOptions.width = 350;

    tempChartOptions.height = 300;
    tempChartOptions.vAxis = new ChartOptionsAxis();
    tempChartOptions.xAxis = new ChartOptionsAxis();

    let date = new Date();
    date.setDate(date.getDate() -365);
  // date.toISOString().split('T')[0] - temp remove
    this.fhirService.getEPRObservationsByCode(this.patientId,this.code, undefined)
      .subscribe(bundle =>  {

          this.observations = [];

          if (bundle != undefined && bundle.entry != undefined && bundle.entry.length > 0) {

            var series1code = undefined;

            for (var i = 0; (i < bundle.entry.length); i++) {
              this.observations[i] = <fhir.Observation>bundle.entry[i].resource;
              //console.log(this.observations[i]);
              if (this.observations[i].component == undefined) {

                // Non complex type

                if (i==0) {
                  tempChartOptions.title = this.observations[i].code.coding[0].display;
                  let unit = this.observations[i].valueQuantity.unit;
                  console.log("Unit = "+unit);
                  if (unit == "-") unit = "Nil";
                  console.log("Unit = "+unit);
                  tempChartData.push(
                    ['Date',
                      unit]);

                  tempChartOptions.vAxis.title = unit;
                  tempChartOptions.vAxis.title = unit;
                }
                console.log(this.getDateNumber(this.observations[i].effectiveDateTime) +" == "+ this.observations[i].valueQuantity.value);
                if (this.observations[i].effectiveDateTime != undefined && this.observations[i].valueQuantity != undefined) {
                  //tempChartData.push([ new Date(), i]);
                  tempChartData.push([ this.getDateNumber(this.observations[i].effectiveDateTime), this.observations[i].valueQuantity.value]);
                }
              } else {

                // Component

                if (i==0) {
                  tempChartOptions.title = this.observations[i].code.coding[0].display;
                  tempChartOptions.vAxis.title = this.observations[i].component[0].valueQuantity.unit;

                  series1code = this.observations[i].component[0].code.coding[0].code;

                  tempChartData.push(['Date', this.observations[i].component[0].code.coding[0].display, this.observations[i].component[1].code.coding[0].display]);
                }

                if (this.observations[i].effectiveDateTime != undefined) {
                  var series1 = undefined;
                  var series2 = undefined;
                  if  (this.observations[i].component[0].valueQuantity != undefined) {
                    if (this.observations[i].component[0].code.coding[0].code == series1code) {
                      series1 = this.observations[i].component[0].valueQuantity.value;
                    } else {
                      series2 = this.observations[i].component[0].valueQuantity.value;
                    }
                  }
                  if  (this.observations[i].component[1].valueQuantity != undefined) {
                    if (this.observations[i].component[1].code.coding[0].code == series1code) {
                      series1 = this.observations[i].component[1].valueQuantity.value;
                    } else {
                      series2 = this.observations[i].component[1].valueQuantity.value;
                    }
                  }
                  tempChartData.push([ this.getDateNumber(this.observations[i].effectiveDateTime), series1, series2])
                }

              }
            }
          }
        },
        (err) => { this.logError(err,"Observation")},
        () => {
        console.log('Finished Data load')
          this.obs_ChartOptions = tempChartOptions;
          this.obs_ChartData = tempChartData;
        })
  }
  public getDateNumber(date : string ) : Date {
    return new Date(date);
  }


  logError(message, title : string) {

    console.log(message);
  }




  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

}
