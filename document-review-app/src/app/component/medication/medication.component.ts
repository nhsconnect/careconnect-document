import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {

  @Input() medications : fhir.Medication[];
  constructor(private linksService : LinksService) { }

  @Output() medication = new EventEmitter<any>();

  ngOnInit() {
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  getDMDLink(code : fhir.Coding) {
    window.open(this.linksService.getDMDLink(code), "_blank");
  }
  getSNOMEDLink(code : fhir.Coding) {
    window.open(this.linksService.getSNOMEDLink(code), "_blank");

  }
  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }
  select(medication) {
    this.medication.emit(medication);
  }
}
