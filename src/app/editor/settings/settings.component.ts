import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IColor } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // Initialize the color var with the background color provided in the injected data
  // If no color os found, default to #fff or white
  color = this.rgbToHex(this.data.backgroundColor || {r:255,g:255,b:255}); 

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any ) { }

  // Number to hex converter
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  // RGB to hex converter
  rgbToHex(color: IColor) {
    return "#" + this.componentToHex(color.r) + this.componentToHex(color.g) + this.componentToHex(color.b);
  }

  // Hex to rgb converter
  hexToRgb(hex): IColor {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  updateColor(newColor) {
    // Update settings using the callback provided in the injected data
    // Update the backgroundColor to the color selected
    // Before updating the backgroundColor, convert the hex value to RGB
    this.data.updateSettings('backgroundColor', this.hexToRgb(newColor));
  }

  ngOnInit() {
    this.data.updateSettings('test', 'test2');
  }

}
