import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-prescription',
  templateUrl: './epr-prescription.component.html',
  styleUrls: ['./epr-prescription.component.css']
})
export class EprPrescriptionComponent implements OnInit {

  @Input() prescriptions : fhir.MedicationRequest[];

  @Input() presTotal : number;

  constructor() { }

  ngOnInit() {
  }

}
