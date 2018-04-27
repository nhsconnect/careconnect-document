import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  @Input() procedures : fhir.Procedure[];

  constructor(private linksService : LinksService) { }

  ngOnInit() {
  }

  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }
  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }
}
