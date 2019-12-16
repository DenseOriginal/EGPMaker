import { Component, OnInit, OnDestroy } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  private p5;
  constructor() { }

  ngOnInit() {
    console.log('editor-init');
    this.createCanvas();
  }

  ngOnDestroy(): void {
    this.destroyCanvas();
    console.log('editor-destroy');
  }

  // Creating the canvas
  private createCanvas = () => {
    console.log('creating canvas');
    this.p5 = new p5(this.editorSketch);
  }

  // Removing the canvas from the screen
  private destroyCanvas = () => {
    console.log('destroying canvas');
    this.p5.noCanvas();
  }

  // Actual p5 Sketch
  private editorSketch(p: p5) {
    let tempObject = <any>{} // Remove later
    var mouse = {x: 0, y: 0}; // Object to contain the x, y position of the mouse

    p.setup = () => {
      p.createCanvas(window.innerWidth / 2.5, window.innerWidth / 2.5).parent('editor-canvas');
      p.angleMode(p.DEGREES);
      p.background(255, 175, 175);
    };

    p.draw = () => {
      p.background(255);

      if(tempObject.pos1) {
        if(tempObject.pos2) {
          p.rect(tempObject.pos1.x, tempObject.pos1.y, tempObject.pos2.x, tempObject.pos2.y);
        } else {
          p.rect(tempObject.pos1.x, tempObject.pos1.y, mouse.x - tempObject.pos1.x, mouse.y - tempObject.pos1.y)

        }
      }

      // Other stuff that happens every time the screen draws something
    }

    p.mouseMoved = p.mouseDragged = () => {
      // Update the mouse object everytime the mouse moves
      // Should happen before any other mouse function
      mouse.x = Math.min(Math.max(p.mouseX, 0), p.width); // Limits mouse.x to inside the screen
      mouse.y = Math.min(Math.max(p.mouseY, 0), p.height); // Limits mouse.y to inside the screen
      console.log(3)
    }

    p.mousePressed = () => {
      console.log(1);
      if(p.mouseX > p.width || p.mouseX < 0 || p.mouseY > p.height || p.mouseY < 0) return;
      if(!tempObject.pos1) {
        tempObject.pos1 = {
          x: mouse.x,
          y: mouse.y
        }
      } else {
        tempObject = {};
        tempObject.pos1 = {
          x: mouse.x,
          y: mouse.y
        }
      }
    }

    p.mouseReleased = () => {
      console.log(2);
      tempObject.pos2 = {
        x: mouse.x - tempObject.pos1.x,
        y: mouse.y - tempObject.pos1.y
      }
      console.log(tempObject);
    }

  }

  

}

