import { Component, OnInit } from '@angular/core';
import {DataSet, Edge, Network, Timeline} from "vis";

@Component({
  selector: 'app-timeline-graph',
  templateUrl: './timeline-graph.component.html',
  styleUrls: ['./timeline-graph.component.css']
})
export class TimelineGraphComponent implements OnInit {

  constructor() { }

  public timeline : Timeline;

  public ngOnInit(): void {



    var items = new DataSet([
      {id: 1, content: 'item 1', start: '2017-04-20'},
      {id: 2, content: 'item 2', start: '2017-04-14'},
      {id: 3, content: 'item 3', start: '2017-04-18'},
      {id: 4, content: 'item 4', start: '2017-04-16', end: '2017-04-19'},
      {id: 5, content: 'item 5', start: '2017-04-25'},
      {id: 6, content: 'item 6', start: '2017-04-27'}
    ]);
    // create a network
    let container = document.getElementById('timelinevis');

    let options  = { rollingMode: undefined };
    options.rollingMode = { follow : false };
   // this.network = new Network(container, data, options);
    this.timeline = new Timeline(container, items, options);
  }

}
