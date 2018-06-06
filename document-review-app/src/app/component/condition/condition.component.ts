import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit {

  @Input() conditions : fhir.Condition[];

  @Output() condition = new EventEmitter<any>();

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

  select(condition) {
    this.condition.emit(condition);
  }
}
