import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  @Input() procedures : fhir.Procedure[];

  constructor() { }

  ngOnInit() {
  }
  getSNOMEDLink(code : string) {
    window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001", "_blank");
  }
}
