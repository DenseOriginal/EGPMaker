import { Component, OnInit, Input } from '@angular/core';
import { ShapeClass } from '../EGPShape-classes';
import { IColor } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-object-manipulator',
  templateUrl: './object-manipulator.component.html',
  styleUrls: ['./object-manipulator.component.scss']
})
export class ObjectManipulatorComponent implements OnInit {
  @Input() selectedObject: ShapeClass;

  color: string = '#000000';

  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  rgbToHex(color: IColor) {
    return "#" + this.componentToHex(color.r) + this.componentToHex(color.g) + this.componentToHex(color.b);
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  updateObjectStyling(property: string, e) {
    // Update the selected style property to what is chosen by the user
    this.selectedObject.style[property] = e.checked;
  }

  updateColor(e) {
    this.selectedObject.setColor(this.hexToRgb(this.color));
  }

  constructor() { }

  ngOnInit() {
    this.color = this.selectedObject ? this.rgbToHex(this.selectedObject.color) : '#000000'
  }

}