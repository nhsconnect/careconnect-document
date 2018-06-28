import {Component, Inject, Input, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

declare var $: any;

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {


  //https://stackoverflow.com/questions/44987260/how-to-add-jstree-to-angular-2-application-using-typescript-with-types-jstree


  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data) {
    this.locations = data.locations;
    this.locationId = data.locationId;
  }

  @Input()
  locations : fhir.Location[];

  @Input()
  locationId : string;


  ngOnInit() {



  }
 }


