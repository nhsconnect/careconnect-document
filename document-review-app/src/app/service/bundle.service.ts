import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  private bundle : fhir.Bundle;

  constructor() { }

  public setBundle(bundle : fhir.Bundle) {
    this.bundle = bundle;
  }

  public getBundle() : fhir.Bundle {
    return this.bundle;
  }


  public getResource(reference : string) : fhir.Resource {

    let resourceRes :fhir.Resource = undefined;
    for (let resource of this.bundle.entry) {
      if (resource.fullUrl === reference || resource.resource.id === reference) {
        console.log(resource.resource.resourceType);
        resourceRes = resource.resource;
      }
    }
      return resourceRes;
    }


}
