import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-medication-statement',
  templateUrl: './medication-statement.component.html',
  styleUrls: ['./medication-statement.component.css']
})
export class MedicationStatementComponent implements OnInit {

  @Input() medicationStatements : fhir.MedicationStatement[];
  constructor() { }

  ngOnInit() {
  }

  getDMDLink(code : string) {
    window.open('http://dmd.medicines.org.uk/DesktopDefault.aspx?VMP='+code+'&toc=nofloat', "_blank");
  }
  getSNOMEDLink(code : string) {
    window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001", "_blank");
  }
}
