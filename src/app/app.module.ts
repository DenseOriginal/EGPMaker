import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { EditorComponent } from './editor/editor.component';
import { ToolSelectionComponent } from './editor/tool-selection/tool-selection.component';
import { ObjectManipulatorComponent } from './editor/object-manipulator/object-manipulator.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CompilerOutputComponent } from './editor/compiler-output/compiler-output.component';
import { SavedSketchesComponent } from './editor/saved-sketches/saved-sketches.component';
import { SettingsComponent } from './editor/settings/settings.component';
import { KeyboardShortcutsModule  } from "ng-keyboard-shortcuts";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ToolSelectionComponent,
    ObjectManipulatorComponent,
    CompilerOutputComponent,
    SavedSketchesComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ColorPickerModule,
    KeyboardShortcutsModule.forRoot()
  ],
  entryComponents: [
    CompilerOutputComponent,
    SavedSketchesComponent,
    SettingsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
