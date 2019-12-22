import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { EditorComponent } from './editor/editor.component';
import { ToolSelectionComponent } from './editor/tool-selection/tool-selection.component';
import { ObjectManipulatorComponent } from './editor/object-manipulator/object-manipulator.component';
import { ColorChromeModule } from 'ngx-color/chrome';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolSelectionComponent,
    ObjectManipulatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ColorChromeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
