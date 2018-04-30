import { Component, OnInit } from '@angular/core';
import {PatientEprService} from "../../service/patient-epr.service";

@Component({
  selector: 'app-patient-epr-find',
  templateUrl: './patient-epr-find.component.html',
  styleUrls: ['./patient-epr-find.component.css']
})
export class PatientEprFindComponent implements OnInit {

  constructor(private patientChange : PatientEprService) { }

  ngOnInit() {
    this.patientChange.clear();
  }

}
