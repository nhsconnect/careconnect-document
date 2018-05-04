import { Component, OnInit } from '@angular/core';
import {PatientEprService} from "../../service/patient-epr.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-patient-find',
  templateUrl: './patient-find.component.html',
  styleUrls: ['./patient-find.component.css']
})
export class PatientFindComponent implements OnInit {

  constructor(private patientChange : PatientEprService,  private router: Router) { }

  ngOnInit() {
    this.patientChange.clear();
  }

  selectPatient(patient : fhir.Patient) {
    if (patient !=undefined) {

        this.router.navigate(['epr/'+patient.id ] );

    }
  }

}
