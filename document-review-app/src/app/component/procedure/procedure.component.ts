import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ConditionDataSource} from "../../data-source/condition-data-source";
import {ProcedureDataSource} from "../../data-source/procedure-data-source";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  @Input() procedures : fhir.Procedure[];

  @Output() procedure = new EventEmitter<any>();

  @Input() patientId : string;

  dataSource : ProcedureDataSource;

  displayedColumns = ['performed', 'code','codelink','status', 'bodysite', 'complication', 'resource'];

  constructor(private linksService : LinksService,
              public dialog: MatDialog,
              public fhirService : FhirService) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new ProcedureDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new ProcedureDataSource(this.fhirService, undefined, this.procedures);
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
