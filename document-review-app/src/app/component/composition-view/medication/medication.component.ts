import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {

  @Input() medications : fhir.Medication[];
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
