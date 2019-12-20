import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { EditorComponent } from './editor/editor.component';
import { ToolSelectionComponent } from './editor/tool-selection/tool-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolSelectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
