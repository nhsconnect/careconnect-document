import {Component, Inject, Input, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

declare var $: any;

@Component({
  selector: 'app-practitioner-role-dialog',
  templateUrl: './practitioner-role-dialog.component.html',
  styleUrls: ['./practitioner-role-dialog.component.css']
})
export class PractitionerRoleDialogComponent implements OnInit {


  //https://stackoverflow.com/questions/44987260/how-to-add-jstree-to-angular-2-application-using-typescript-with-types-jstree


  constructor(
    public dialogRef: MatDialogRef<PractitionerRoleDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data)
  {

    this.practitioner = data.practitioner;
  }

  practitioner : fhir.Practitioner;



  ngOnInit() {



  }
 }


