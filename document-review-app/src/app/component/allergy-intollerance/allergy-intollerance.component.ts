import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-allergy-intollerance',
  templateUrl: './allergy-intollerance.component.html',
  styleUrls: ['./allergy-intollerance.component.css']
})
export class AllergyIntolleranceComponent implements OnInit {

  @Input() allergies : fhir.AllergyIntolerance[];

  constructor(private linksService : LinksService) { }

  ngOnInit() {
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }
}
