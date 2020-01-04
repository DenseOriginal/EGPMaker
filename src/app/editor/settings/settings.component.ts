import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  color = '#000'

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any ) { }

  updateColor(newColor) {

  }

  ngOnInit() {
    this.data.updateSettings('test', 'test2');
  }

}
