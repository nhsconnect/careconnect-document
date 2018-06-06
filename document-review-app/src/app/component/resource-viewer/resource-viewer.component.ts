import {Component, Input, OnInit} from '@angular/core';
import integer = fhir.integer;
import {PatientEprService} from "../../service/patient-epr.service";

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.css']
})
export class ResourceViewerComponent implements OnInit {

  constructor(public patientEPRService : PatientEprService) { }

  nodes = [];

  options = {};

  nodeId: integer;

  @Input()
  resource = undefined;


  ngOnInit() {
    this.patientEPRService.getResourceChangeEvent().subscribe(
      resource => {
        this.resource = resource;
        this.buildNodes();
      }
    )

  }

  buildNodes() {
    this.nodes = [];
    this.nodeId = 0;
    for (let key in this.resource) {
      if (this.resource.hasOwnProperty(key)) {
        this.nodes.push( this.iterateNodes(this.resource,key));
      }
    }
  }

  iterateNodes (jsonRes, key) {

      this.nodeId++;

      if (typeof jsonRes[key] == "object") {
          console.log(key + ": " + jsonRes[key]);
          let node = {
            'id': this.nodeId,
            'name': key,
            children: [
            ]
          };
        for (let childkey in jsonRes[key]) {
          if (jsonRes[key].hasOwnProperty(childkey)) {
            node.children.push( this.iterateNodes(jsonRes[key], childkey));
          }
        }
          return node;
      } else {
          console.log(key + ": " + jsonRes[key]);
          return {
            'id': this.nodeId,
            'name': key + ": " + jsonRes[key],
            children: [
            ]
          };
      }

    }

 }


