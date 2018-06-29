import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-practitioner-role',
  templateUrl: './practitioner-role.component.html',
  styleUrls: ['./practitioner-role.component.css']
})
export class PractitionerRoleComponent implements OnInit {

  @Input() roles : fhir.PractitionerRole[];

  @Output() practitionerRole = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

}
