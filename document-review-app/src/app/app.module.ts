import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoadDocumentComponent } from './component/load-document/load-document.component';
import { NavComponent } from './component/nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LoadDocumentFileComponent } from './component/load-document-file/load-document-file.component';
import {FileUploadModule} from "ng2-file-upload";




@NgModule({
  declarations: [
    AppComponent,
    LoadDocumentComponent,
    NavComponent,
    LoadDocumentFileComponent
   // AngularFontAwesomeModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    NgbModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
