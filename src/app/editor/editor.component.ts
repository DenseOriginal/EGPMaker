import { Component, OnInit, OnDestroy } from "@angular/core";
import { IShape, EGPShapes, Tools, IPosition } from "../shared/interfaces";
import * as p5 from "p5";

// Note:
// Change tempObject to accommodate all the different shapes
// When drawing the tempObject, switch between different shapes

// Global variables, so that both EditorComponent and the p5js sketch can use them
// Can't find out how to pass variables betweem them, other that this...
// Kinda gross, but whatever
var objectStack: IShape[] = []; // Stack to hold all the objects drawn to the screen

// The different types of tools are defined in ../shared/interfaces.ts
var selectedTool: Tools = "cursor"; // The tool that is currently selected

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit, OnDestroy {
  private p5;
  constructor() {}

  changeTool(e: Tools) {
    selectedTool = e;
  }

  ngOnInit() {
    // Create the canvas when the component is created
    this.createCanvas();
  }

  ngOnDestroy(): void {
    // Remove the canvas from screen, if the component is removed
    this.destroyCanvas();
  }

  // Creating the canvas
  private createCanvas = () => {
    // Create a new p5 instance, from the function editorSketch
    // Save the instance in a variale so that it can be called later, to be removed from the screen
    this.p5 = new p5(this.editorSketch);
  };

  // Removing the canvas from the screen
  private destroyCanvas = () => {
    this.p5.noCanvas();
  };

  // Actual p5 Sketch
  private editorSketch(p: p5) {
    var tempObject = <IShape>{ position: [] }; // Object to store tempporary information, such as shape, color and position
    var mouse = { x: 0, y: 0 }; // Object to contain the x, y position of the mouse
    var canvas; // p5 canvas

    p.setup = () => {
      canvas = p
        .createCanvas(window.innerWidth / 2.5, window.innerWidth / 2.5)
        .parent("editor-canvas");
      canvas.style("border", "solid 0.5px black");
      p.angleMode(p.DEGREES);
      p.background(255, 175, 175);
    };

    p.draw = () => {
      p.background(255);
      p.strokeWeight(0.5);

      // Draw every object in the object stack
      objectStack.forEach(object => {
        p.fill(object.color.r, object.color.g, object.color.b, object.color.a); // Set fill color to the object color

        // Switch between the different types of shapes
        switch (object.objectData.type) {
          case "box":
            // Draw a rectangle using the measurements from the objectStack
            // First object in the position array, is the point where it should start to draw from
            // Second object in the position array, is the width and height
            p.rect(
              object.position[0].x,
              object.position[0].y,
              object.position[1].x,
              object.position[1].y
            );
            break;

          default:
            break;
        }
      });

      // Draw tempObject on top of every thing else
      if (tempObject.position && tempObject.objectData) {
        switch (tempObject.objectData.type) {
          case "box":
            p.rect(
              tempObject.position[0].x,
              tempObject.position[0].y,
              mouse.x - tempObject.position[0].x,
              mouse.y - tempObject.position[0].y
            );
            break;

          default:
            break;
        }
      }

      // Other stuff that happens every time the screen refreshes
    };

    p.mouseMoved = p.mouseDragged = () => {
      // Update the mouse object everytime the mouse moves
      // Should happen before any other mouse function
      mouse.x = Math.min(Math.max(p.mouseX, 0), p.width); // Limits mouse.x to inside the screen
      mouse.y = Math.min(Math.max(p.mouseY, 0), p.height); // Limits mouse.y to inside the screen
    };

    p.mousePressed = () => {
      // If the mouse is outside the canvas, nothing should happen.
      if (
        p.mouseX > p.width ||
        p.mouseX < 0 ||
        p.mouseY > p.height ||
        p.mouseY < 0
      )
        return;

      // Only create a new object if the selected tool isn't cursor
      if (selectedTool !== "cursor") {
        // Replace with something else
        switch (selectedTool) {
          case "box":
            tempObject.objectData = { type: "box" };
            tempObject.position = [{ x: mouse.x, y: mouse.y }];
            tempObject.color = { r: 255, g: 175, b: 175 };
            break;

          default:
            break;
        }
      }
    };

    p.mouseReleased = () => {
      console.log(tempObject);
      // Don't create a new object if the selectedTool is cursor
      if (selectedTool !== "cursor") {
        // Replace with something else
        if (!tempObject.position) return; // Escpae the function if tempObject.position is undefined
        tempObject.position[1] = {
          x: mouse.x - tempObject.position[0].x,
          y: mouse.y - tempObject.position[0].y
        };

        // Push the tempObject to the objectStack
        objectStack.push(tempObject);

        // Empty the tempObject so it's ready for a new object
        tempObject = <IShape>{};
      }
    };
  }
}
