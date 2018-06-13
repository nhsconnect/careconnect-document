import {Component, Input, OnInit} from '@angular/core';
import integer = fhir.integer;
import {PatientEprService} from "../../service/patient-epr.service";

declare var $: any;

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.css']
})
export class ResourceViewerComponent implements OnInit {


  //https://stackoverflow.com/questions/44987260/how-to-add-jstree-to-angular-2-application-using-typescript-with-types-jstree


  constructor(public patientEPRService : PatientEprService) { }

  nodes = [];

  treeData = [];

  options = {};

  nodeId: integer;

  @Input()
  resource = undefined;


  ngOnInit() {
    console.log('Init Called TREE');
    if (this.resource != undefined) {
      this.buildNodes();

      $('#docTreeView').jstree('destroy');

      $('#docTreeView').jstree({
        'core' : {
          'data' : this.treeData
        }
      });
    }

    this.patientEPRService.getResourceChangeEvent().subscribe(
      resource => {
        this.resource = resource;
        this.buildNodes();

        $('#docTreeView').jstree('destroy');

        $('#docTreeView').jstree({
          'core' : {
            'data' : this.treeData
          }
        });
      }
    )

  }





  buildNodes() {
    this.nodes = [];
    this.treeData = [];
    this.nodeId = 0;
    for (let key in this.resource) {
      if (this.resource.hasOwnProperty(key)) {
       // console.log(this.treeData);
        this.treeData.push(this.iterateTreeNodes(this.resource,key));

      }
    }
  }


  entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  escapeHtml(source: string) {
    return String(source).replace(/[&<>"'\/]/g, s => this.entityMap[s]);
  }

  iterateTreeNodes (jsonRes, key) {

    this.nodeId++;

    if (typeof jsonRes[key] == "object") {

      let node = {
        'id': this.nodeId,
        'text': this.escapeHtml(key),
        'state' : { opened: true },
        'children' : []

      };
      for (let childkey in jsonRes[key]) {
        if (jsonRes[key].hasOwnProperty(childkey)) {

          node.children.push( this.iterateTreeNodes(jsonRes[key], childkey));
        }
      }

      return node;
    } else {
      return {
        'id': this.nodeId,
        'icon' : '.',
        'text': key + " - " + '<b>'+ this.escapeHtml(jsonRes[key])+ '</b>'
      };
    }

  }
  /*
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
*/
 }


