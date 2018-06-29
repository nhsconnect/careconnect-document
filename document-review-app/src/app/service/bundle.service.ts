import { Injectable } from '@angular/core';
import {FhirService} from "./fhir.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  private bundle : fhir.Bundle;

  constructor(private fhirService : FhirService) { }

  public setBundle(bundle : fhir.Bundle) {
    this.bundle = bundle;
  }

  public getBundle() : fhir.Bundle {
    return this.bundle;
  }

  public getPractitionerReference(reference : string)  : fhir.PractitionerRole[] {
    let roles : fhir.PractitionerRole[] = [];
    console.log(reference);
    if (this.bundle != undefined && reference.indexOf('/') == -1) {
      for (let entry of this.bundle.entry) {
        if (entry.resource.resourceType == 'PractitionerRole') {
          console.log(entry.resource.id);
          console.log(reference);
          let role: fhir.PractitionerRole = <fhir.PractitionerRole> entry.resource;
          if (role.practitioner != undefined && role.practitioner.reference === reference) {
            console.log(entry.resource.resourceType);
            roles.push(<fhir.PractitionerRole> entry.resource);
          }
        }
      }
    }
    return roles;
  }

  public getResource(reference : string) : Observable<fhir.Resource> {
    console.log("Bundle Get Reference = " +reference);

    let resource : fhir.Resource  = undefined;
    let _resource: BehaviorSubject<fhir.Resource> =<BehaviorSubject<fhir.Resource>>new BehaviorSubject([]);

    let resourceRes :fhir.Resource = undefined;
    if (this.bundle != undefined && reference.indexOf('/') == -1) {
      for (let entry of this.bundle.entry) {
        if (entry.fullUrl === reference || entry.resource.id === reference) {
          console.log(entry.resource.resourceType);
          resource = entry.resource;
          _resource.next(resource);
        }
      }
    } else {
      return this.fhirService.getResource(reference);
    }
      return _resource;
    }


}
