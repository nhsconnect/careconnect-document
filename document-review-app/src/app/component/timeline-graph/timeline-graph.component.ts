import {Component, Input, OnInit} from '@angular/core';
import { DataSet, Network, Timeline} from "vis";

declare var vis: any;

@Component({
  selector: 'app-timeline-graph',
  templateUrl: './timeline-graph.component.html',
  styleUrls: ['./timeline-graph.component.css']
})
export class TimelineGraphComponent implements OnInit {

  @Input() encounters : fhir.Encounter[];

  @Input() conditions : fhir.Condition[];

  constructor() { }


  public ngOnInit(): void {

    // create a network
    var container = document.getElementById('timeline');


    var names = ['Encounter', 'Condition'];
    var groups = new DataSet();
    let g= 0;
    for (let name of names) {
      groups.add({id: g, content: name});
      g++;
    }

    var items = new DataSet([]);
    for (let encounter of this.encounters) {
      if (encounter.type != undefined && encounter.type.length>0) {
        items.add({
          id: encounter.id,
          group : 0,
          content: encounter.type[0].coding[0].display, start: encounter.period.start
        });
      } else {
        items.add({
          id: encounter.id,
          group : 0,
          content: 'nos', start: encounter.period.start
        });
      }
    }
    for (let condition of this.conditions) {
      if (condition.code != undefined && condition.code.coding.length>0) {
        items.add({
          id: condition.id,
          group : 1,
          content: condition.code.coding[0].display,
          start: this.getConditionDate(condition),
          className: 'green'
        });
      } else {
        items.add({
          id: condition.id,
          group : 1,
          content: 'nos',
          start: this.getConditionDate(condition)
        });
      }
    }

    var optiont : vis.TimelineOptions = {
      width: '100%',
      height: '300px',
      start: '2016-05-02',
      end :'2018-08-08'

    };
    optiont.rollingMode = {};
    optiont.rollingMode.follow = false;
    optiont.rollingMode.offset = 0.5 ;

    var timeline = new Timeline(container, items, groups , optiont);




  }

  getConditionDate(condition : fhir.Condition) {
    if (condition.onsetDateTime != undefined) return condition.onsetDateTime;
    if (condition.assertedDate !=undefined) return condition.assertedDate;
  }

}
