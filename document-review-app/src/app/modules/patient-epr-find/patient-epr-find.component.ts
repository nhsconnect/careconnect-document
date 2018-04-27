import { Component, OnInit } from '@angular/core';
import {PatientChangeService} from "../../service/patient-change.service";

@Component({
  selector: 'app-patient-epr-find',
  templateUrl: './patient-epr-find.component.html',
  styleUrls: ['./patient-epr-find.component.css']
})
export class PatientEprFindComponent implements OnInit {

  constructor(private patientChange : PatientChangeService) { }

  ngOnInit() {
    this.patientChange.clear();
  }

}
