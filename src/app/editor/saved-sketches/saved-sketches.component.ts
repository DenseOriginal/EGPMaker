import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-saved-sketches',
  templateUrl: './saved-sketches.component.html',
  styleUrls: ['./saved-sketches.component.scss']
})
export class SavedSketchesComponent implements OnInit {
  constructor(private _BottomSheetRef: MatBottomSheetRef<SavedSketchesComponent>) { }

  // Load and parse the saved sketches and render them in the HTML
  savedSketches = localStorage.getItem('savedSketches') || '[]';
  parsedSketches = JSON.parse(this.savedSketches).map(e => JSON.parse(e));

  // Close the menu if one sketch is clicked
  clickHandler(sketch) {
    this._BottomSheetRef.dismiss(sketch);
  }

  ngOnInit() {
  }

}
