import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ProcedureDataSource} from "../../data-source/procedure-data-source";
import {ImmunizationDataSource} from "../../data-source/immunization-data-source";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-immunisation',
  templateUrl: './immunisation.component.html',
  styleUrls: ['./immunisation.component.css']
})
export class ImmunisationComponent implements OnInit {

  @Input() immunisations : fhir.Immunization[];

  @Input() patientId : string;

  dataSource : ImmunizationDataSource;

  displayedColumns = ['date', 'code','codelink','status',  'resource'];

  constructor(private linksService : LinksService,
              public dialog: MatDialog,
              public fhirService : FhirService) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new ImmunizationDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new ImmunizationDataSource(this.fhirService, undefined, this.immunisations);
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
