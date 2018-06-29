import {Component, Inject, Input, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

declare var $: any;

@Component({
  selector: 'app-organisation-dialog',
  templateUrl: './organisation-dialog.component.html',
  styleUrls: ['./organisation-dialog.component.css']
})
export class OrganisationDialogComponent implements OnInit {


  //https://stackoverflow.com/questions/44987260/how-to-add-jstree-to-angular-2-application-using-typescript-with-types-jstree


  constructor(
    public dialogRef: MatDialogRef<OrganisationDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data) {
    this.organisations = data.organisations;
    //this.organisationId = data.organisationId;
  }

  @Input()
  organisations : fhir.Organization[];

  @Input()
  organisationId : string;


  ngOnInit() {



  }
 }


