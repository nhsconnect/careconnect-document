import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {ResourceDialogComponent} from "../resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ObservationDataSource} from "../../data-source/observation-data-source";
import {ConditionDataSource} from "../../data-source/condition-data-source";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit {

  @Input() conditions : fhir.Condition[];

  @Output() condition = new EventEmitter<any>();

  @Input() patientId : string;

  dataSource : ConditionDataSource;

  displayedColumns = ['asserted','onset', 'code','codelink','category','categorylink', 'clinicalstatus','verificationstatus', 'resource'];

  constructor(private linksService : LinksService, public dialog: MatDialog, public fhirService : FhirService) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new ConditionDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new ConditionDataSource(this.fhirService, undefined, this.conditions);
    }
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

  select(resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    let resourceDialog : MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }
}
