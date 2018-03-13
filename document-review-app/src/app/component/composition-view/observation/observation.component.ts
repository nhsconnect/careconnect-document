import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  @Input() observations : fhir.Observation[];
  constructor() { }

  ngOnInit() {
  }



  getValue(observation : fhir.Observation) : string {
    //console.log("getValue called" + observation.valueQuantity.value);
    if (observation == undefined) return "";

    if (observation.valueQuantity != undefined ) {
      //console.log(observation.valueQuantity.value);
      return observation.valueQuantity.value.toPrecision(4) + " " + observation.valueQuantity.unit;
    }

    if (observation.component == undefined || observation.component.length < 2)
      return "";
    // Only coded for blood pressures at present
    if (observation.component[0].valueQuantity == undefined )
      return "";
    if (observation.component[1].valueQuantity == undefined )
      return "";

    return observation.component[0].valueQuantity.value + "/"+ observation.component[1].valueQuantity.value + " " + observation.component[1].valueQuantity.unit;

  }

  isSNOMED(code: string) : boolean {
    if (code == undefined) return false;
    if (!((+code).toString() === code)) {
      //console.log("Not a number = "+code);
      return false;
    }
    if (code.length<6) return false;
    return true;

  }


  getSNOMEDLink(code : string) {
    if (this.isSNOMED(code)) {
      window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1=" + code + "&edition=uk-edition&release=v20171001", "_blank");
    }
  }

}
