import { Component, OnInit } from '@angular/core';
import {DataSet, Network, Timeline} from "vis";

declare var vis: any;

@Component({
  selector: 'app-timeline-graph',
  templateUrl: './timeline-graph.component.html',
  styleUrls: ['./timeline-graph.component.css']
})
export class TimelineGraphComponent implements OnInit {

  constructor() { }


  public ngOnInit(): void {

    // create a network
    var container = document.getElementById('timeline');


    var items  = new DataSet([
      {id: 1, content: 'item 1', start: '2017-04-02'},
      {id: 2, content: 'item 2', start: '2017-04-07'},
      {id: 3, content: 'item 3', start: '2017-04-08'},
      {id: 4, content: 'item 4', start: '2017-05-02', end: '2017-05-10'},
      {id: 5, content: 'item 5', start: '2017-05-08'},
      {id: 6, content: 'item 6', start: '2017-05-12'}
    ]);


    var optiont : vis.TimelineOptions = {};
    optiont.rollingMode = {};
    optiont.rollingMode.follow = true;
    optiont.rollingMode.offset = 0.5 ;

    var timeline = new Timeline(container, items);

    var nodes = new DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);
    // create an array with edges
    var edges = new DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 3}
    ]);
    // create a network
    var containern = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options  = {};

    var network = new Network(containern, data, options);
  }

}
