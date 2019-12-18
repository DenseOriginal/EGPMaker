import { Component, OnInit, OnDestroy } from "@angular/core";
import { IShape, EGPShapes, Tools, IPosition, IShapeChanges } from "../shared/interfaces";
import * as p5 from "p5";

// Note:
// Change tempObject to accommodate all the different shapes
// When drawing the tempObject, switch between different shapes

// Global variables, so that both EditorComponent and the p5js sketch can use them
// Can't find out how to pass variables betweem them, other that this...
// Kinda gross, but whatever

// The different types of tools are defined in ../shared/interfaces.ts
var selectedTool: Tools = "cursor"; // The tool that is currently selected

// Empty funtion that is gonna get defined in the editorSketch function or Editor component
// This allows the editor component, and the p5 sketch to communicate
var updateSelectedTool: Function; // Run a function in skecth that does something depending on the current tool
var updateSelectedObject: Function; // Run a function in editorComponent that open a window to edit the object
var history = <any>{};

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit, OnDestroy {
  private p5;
  _history;
  constructor() { }

  changeTool(e: Tools) {
    selectedTool = e;
    updateSelectedTool(e);
  }

  ngOnInit() {
    // Create the canvas when the component is created
    this.createCanvas();
    this._history = history;
    updateSelectedObject = (object: IShape, callback: Function) => {
      // Replace with something that uses data from the client

      var newObject = JSON.parse(JSON.stringify(object)); // Copy the old object to a new var so i don't have to reassign the function arguments
      newObject.color = { r: 175, g: 255, b: 175 }; // Test the function by changing the color
      callback(newObject); // Export the changes out of the function, to the callback

    }
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
    var objectStack: IShape[] = []; // Stack to hold all the objects drawn to the screen
    // when an object is changed the old version of the object is added to the historyArray
    var historyArray: IShapeChanges[] = []; // Stack to hold the history of all object
    var selectedObject: number; // Number to store a selected objects index in the objectStack
    var mouse = { x: 0, y: 0 }; // Object to contain the x, y position of the mouse
    var canvas; // p5 canvas

    // Define the global function, this allows the editorComponent to tell the sketch when the selectedTool changes
    // And run on function depending on what tool is selected
    updateSelectedTool = (tool: Tools) => {
      // Deselect the currently selected object, if a tool that isn't cursor is selected
      if(tool !== "cursor") { selectedObject = undefined }
    }

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
      objectStack.forEach((object, index) => {
        p.fill(object.color.r, object.color.g, object.color.b, object.color.a); // Set fill color to the object color
        if(index == selectedObject) {p.stroke(100, 100, 255);}else{p.stroke(0)} // Remove later

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
      ) return;

      // Only create a new object if the selected tool isn't cursor
      if (selectedTool !== "cursor") {
        // Replace with something else
        switch (selectedTool) {
          case "box":
            tempObject.id = new Date().getTime(); // Set identifier to the timestamp
            tempObject.objectData = { type: "box" };
            tempObject.position = [{ x: mouse.x, y: mouse.y }];
            tempObject.color = { r: 255, g: 175, b: 175 };
            break;

          default:
            break;
        }
      } else { // If the current tool is cursor
        // Loop through each object in the object stack, and determine which is clicked on
        // Do a reverse loop to get the object that is draw on top
        var objectFound = false; // If an object is found, change this variable to true
        for (let i = objectStack.length - 1; i >= 0; --i) {
          const object = objectStack[i];
          if (
            mouse.x > object.position[0].x && // If mouse.x is greater than the objects x cordinate
            mouse.y > object.position[0].y && // If mouse.y is greater than the objects y cordinate
            mouse.x < object.position[0].x + object.position[1].x && // If mouse.x is less than the objects x cordinate plus the width
            mouse.y < object.position[0].y + object.position[1].y // If mouse.y is less than the objects y cordinate plus the height
          ) { // If the statement above evaluates correct, the mouse is inside the object
            selectedObject = i;
            updateSelectedObject(objectStack[i], editObjectData);
            objectFound = true;

            break; // Break out of the loop when it finds the object that has been clicked on
          } else {
            continue;
          }
        }

        // No object was found in the above for-loop
        // And an object is still selected, then deselect the object
        if(!objectFound && !selectedObject) { selectedObject = undefined; }
      }
    };

    p.mouseReleased = () => {
      // Don't create a new object if the selectedTool is cursor
      if (selectedTool !== "cursor") {
        // Replace with something else
        if (!tempObject.position) return; // Escpae the function if tempObject.position is undefined
        tempObject.position[1] = {
          x: mouse.x - tempObject.position[0].x,
          y: mouse.y - tempObject.position[0].y
        };

        // If the width or height is negative, make it positive, and move the x/y back the correct amount
        if(tempObject.position[1].x < 0) { tempObject.position[0].x += tempObject.position[1].x; tempObject.position[1].x = Math.abs(tempObject.position[1].x) }
        if(tempObject.position[1].y < 0) { tempObject.position[0].y += tempObject.position[1].y; tempObject.position[1].y = Math.abs(tempObject.position[1].y) }

        // Push the tempObject to the objectStack
        objectStack.push(tempObject);

        // Empty the tempObject so it's ready for a new object
        tempObject = <IShape>{};
      }
    };

    // Replace the edited object with the old object in the object stack
    function editObjectData(newObject: IShape) {
      // Loop through the object stack and find the matching object id, then replace the object
      objectStack.forEach((object, index) => {
        console.log(newObject);
        if(object.id == newObject.id) {
          // Found the right object

          // Push old data to history array, as an edit change
          history.pushTohistoryArray({
            changeType: 'edit',
            objectData: object
          });
          objectStack[index] = newObject; 
        };
      });
    };

    history = {
      pushTohistoryArray: (change: IShapeChanges) => {
        historyArray.unshift(change); // Add the change to the front of the array
        if(historyArray.length > 5) { historyArray.pop(); } // If the historyArray has more than 5 changes in it
      },

      undo: () => {
        if(historyArray.length == 0) return; // Escape function if historyArray is empty
        // Variable to store the change, and remove it from the historyArray
        let change: IShapeChanges = historyArray.shift();

        // Switch the changeType
        switch (change.changeType) {
          case 'edit':
            // ChangeType is an edit change
            // Replace the changed object with the old object

            // Loop through the objectStack and find the object that was changed
            objectStack.forEach((object, index) => {
              if(object.id == change.objectData.id) {
                // Found the right object
                objectStack[index] = change.objectData;
              };
            });
            break;
        
          default:
            break;
        }
      }
    }
  }
}
