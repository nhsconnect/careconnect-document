import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  @Input() observations : fhir.Observation[];



  selectedObs : fhir.Observation;

  constructor(private linksService : LinksService,private modalService: NgbModal) { }

  ngOnInit() {
  }



  getValue(observation : fhir.Observation) : string {
    //console.log("getValue called" + observation.valueQuantity.value);
    if (observation == undefined) return "";

    if (observation.valueQuantity != undefined ) {
      //console.log(observation.valueQuantity.value);
      return observation.valueQuantity.value.toPrecision(4) + " " + observation.valueQuantity.unit;
    }

    if (observation.component == undefined || observation.component.length < 2)
      return "";
    // Only coded for blood pressures at present
    if (observation.component[0].valueQuantity == undefined )
      return "";
    if (observation.component[1].valueQuantity == undefined )
      return "";

    return observation.component[0].valueQuantity.value + "/"+ observation.component[1].valueQuantity.value + " " + observation.component[1].valueQuantity.unit;

  }

  getCodeSystem(system : string) : string {
     return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }

  getPatientId(observation : fhir.Observation) : string {
    return '1177';
  }

  onClick(content , observation : fhir.Observation) {
    console.log("Clicked - "+ observation.id);
    this.selectedObs = observation;
    //this.router.navigate(['./medicalrecord/'+this.getPatientId(this.observation.subject.reference)+'/observation/'+this.observation.code.coding[0].code ] );
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }

}
