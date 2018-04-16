import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-condition',
  templateUrl: './epr-condition.component.html',
  styleUrls: ['./epr-condition.component.css']
})
export class EprConditionComponent implements OnInit {

  @Input() conditions :fhir.Condition[];

  @Input() conditionTotal :number;

  constructor() { }

  ngOnInit() {
  }

}
