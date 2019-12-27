import { Component, OnInit, Input } from '@angular/core';
import { ShapeClass } from '../EGPShape-classes';
import { IColor } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-object-manipulator',
  templateUrl: './object-manipulator.component.html',
  styleUrls: ['./object-manipulator.component.scss']
})
export class ObjectManipulatorComponent implements OnInit {
  private _selectedObject: ShapeClass
  @Input() set selectedObject(newObject: ShapeClass) {
    this._selectedObject = newObject
    this.color = this.selectedObject ? this.rgbToHex(this.selectedObject.color) : '#000000'; // Update teh color on selectedObject change
  };
  get selectedObject() { return this._selectedObject }

  color: string = '#000000'; // The value for the color picker component

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
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  updatePosition(pos, cordinate, value) {
    this.selectedObject.pos[pos][cordinate] = this.scale(value, 0, 512, 0, this.selectedObject.p.width)
  }

  getPosition(pos, cordinate) {
    return Math.floor(this.scale(this.selectedObject.pos[pos][cordinate], 0, this.selectedObject.p.width, 0, 512))
  }

  updateObjectStyling(property: string, e) {
    // Update the selected style property to what is chosen by the user
    this.selectedObject.style[property] = e.checked;
  }

  // Update the object color
  updateColor(e) {
    this.selectedObject.setColor(this.hexToRgb(this.color));
  }

  constructor() { }

  ngOnInit() {}

}
