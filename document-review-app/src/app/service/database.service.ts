import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Permission} from "../model/permission";
import {AuthService} from "./auth.service";


@Injectable()
export class DatabaseService {

  constructor(private fireDatabase: AngularFireDatabase) { }

  getPermission(userId : string) : Promise<Permission> {
    console.log("Database Get Permission entry for "+ userId);
    return this.fireDatabase.database.ref('/permission/'+userId).once('value')
  }

  setPermission(userId : string, permission : Permission) {
    console.log("Database Set Permission entry for "+ userId);
    return this.fireDatabase.database.ref('/permission/'+userId).set(permission)
  }

}
