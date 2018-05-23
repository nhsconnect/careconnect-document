import { Pipe, PipeTransform } from '@angular/core';
import {error} from "../../model/error";

@Pipe({
  name: 'testFilter'
})
export class TestPipe implements PipeTransform {

    transform(items: any[], error:boolean, warning : boolean, information: boolean) {
    //  console.log("Filter "+error + " " + warning + " " + information);
      if (!items) return items;
      let returnItems :any[] = [];

      return items.filter(item =>
      {
        if (error && item.severity.indexOf('error') !== -1) return true;
        if (warning && item.severity.indexOf('warning') !== -1) return true;
        if (information && item.severity.indexOf('information') !== -1) return true;
        return false;
      });


    }
}
