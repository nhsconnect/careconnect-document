import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FhirService} from "../../service/fhir.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {LinksService} from "../../service/links.service";
import {EprService} from "../../service/epr.service";




@Component({
  selector: 'app-edms-record',
  templateUrl: './edms-record.component.html',
  styleUrls: ['./edms-record.component.css']
})
export class EdmsRecordComponent implements OnInit {

  composition : fhir.Bundle = undefined;

//  encounterdoc : fhir.Bundle = undefined;

  encounters: fhir.Encounter[];
  encTotal : number;

  observations: fhir.Observation[];
  obsTotal : number;

  prescriptions : fhir.MedicationRequest[];
  presTotal : number;

  procedures : fhir.Procedure[];
  procTotal : number;

  conditions : fhir.Condition[];
  conditionTotal : number;

  allergies : fhir.AllergyIntolerance[];
  allergiesTotal : number;

  documents : fhir.DocumentReference[];
  documentsTotal : number;

  immunisations : fhir.Immunization[];
  immsTotal : number;

  patientId : string;

  @Input()
  section : string = undefined;

  page : number;

  graphData = {};

  @ViewChild('tabs')
  private tabs:NgbTabset;

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute,
              private linksService : LinksService,
              private patientEprService : EprService,
              private router : Router
              ) { }


  ngOnInit() {
    this.patientId = this.patientEprService.patient.id;

    //this.selectPatientEPR(this.patientId);

    this.patientEprService.getSectionChangeEvent().subscribe( (section) => {
        console.log("Section = "+this.section);
        this.section = section;
      }
    );

    console.log("Section = "+this.section);
    if (this.section == undefined ) {
      this.section = "documents";
    }


  }


  isSNOMED(system: string) : boolean {
    if (system == undefined) return false;
    if (system == "http://snomed.info/sct")
      return true;

  }

  getCodeSystem(system : string) : string {
    switch(system) {
      case "http://snomed.info/sct": return "SNOMED";
      case "http://loinc.org": return "LOINC";
      default: return system;
    }
  }


  getSNOMEDLink(code : fhir.Coding) {
    if (this.isSNOMED(code.system)) {
      window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1=" + code.code + "&edition=uk-edition&release=v20180401", "_blank");
    }
  }

}
