import { Component, OnInit, OnDestroy } from '@angular/core';
import * as p5 from 'p5';
import { IShape, EGPShapes } from '../shared/interfaces';

// Global variables, so that both EditorComponent and the p5js sketch can use them
// Can't find out how to pass variables betweem them other that this...
// Kinda gross, but whatever
var objectStack: IShape[] = []; // Stack to hold all the objects drawn to the screen

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
    var canvas; // p5 canvas
    var _this: EditorComponent;

    p.setup = () => {
      canvas = p.createCanvas(window.innerWidth / 2.5, window.innerWidth / 2.5).parent('editor-canvas');
      canvas.style('border', 'solid 0.5px black');
      p.angleMode(p.DEGREES);
      p.background(255, 175, 175);
    };

    p.draw = () => {
      p.background(255);
      p.strokeWeight(0.5);

      // Draw every object in the object stack
      objectStack.forEach(object => {
        p.fill(object.color.r, object.color.g, object.color.b, object.color.a); // Set fill color to the object color
        
        switch (object.objectData.type) {
          case 'box':
            p.rect(object.position[0].x, object.position[0].y, object.position[1].x, object.position[1].y)
            break;
        
          default:
            break;
        }
      });

      // Draw tempObject on top of every thing else
      // Replace with something other
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
    }

    p.mousePressed = () => {
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
      if(!tempObject.pos1) return; // Escpae the function if tempObject is undefined
      console.log(tempObject);
      tempObject.pos2 = {
        x: mouse.x - tempObject.pos1.x,
        y: mouse.y - tempObject.pos1.y
      };

      // Create new IShape object, and push it to the objectStack later
      const newShape: IShape = {
        objectData: <EGPShapes.box>{ 
          type: 'box' // Replace static object type with the matching type to the selected tool
        }, 
        position: [ 
          tempObject.pos1, // Replace tempObject wth something else
          tempObject.pos2
        ], 
        color: { 
          r: 255, // Replace static values with values from a selection tool
          g: 175, 
          b: 175 
        }, 
      }
      console.log(newShape);

      // Push to final IShape object to the object stack
      objectStack.push(newShape);

      // Empty the tempObject so it's ready for a new object
      tempObject = {};
    }

  }

  

}

