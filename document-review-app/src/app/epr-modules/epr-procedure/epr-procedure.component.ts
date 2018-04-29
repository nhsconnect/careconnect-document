import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-procedure',
  templateUrl: './epr-procedure.component.html',
  styleUrls: ['./epr-procedure.component.css']
})
export class EprProcedureComponent implements OnInit {

  @Input() procedures :fhir.Procedure[];

  @Input() procTotal :number;

  page : number;

  constructor() { }

  ngOnInit() {
  }

}
