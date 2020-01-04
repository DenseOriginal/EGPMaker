import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { IShape, EGPShapes, Tools, IPosition, IShapeChanges } from "../shared/interfaces";
import * as p5 from "p5";
import { EGPObjects, ShapeClass } from './EGPShape-classes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { compile } from './compiler';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CompilerOutputComponent } from './compiler-output/compiler-output.component';
import { SavedSketchesComponent } from './saved-sketches/saved-sketches.component';
import { SettingsComponent } from './settings/settings.component';
// Global variables, so that both EditorComponent and the p5js sketch can use them
// Can't find out how to pass variables betweem them, other that this...
// Kinda gross, but whatever

// The different types of tools are defined in ../shared/interfaces.ts
var selectedTool: Tools = "select"; // The tool that is currently selected

var objectStack: ShapeClass[] = []; // Stack to hold all the objects drawn to the screen

var isEditorPaused: boolean = false; // Should the editor pause

var isCodeSaved: boolean = false; // Is the current code saved

var sketchName: string = ''; // The name of the sketch

// Empty funtion that is gonna get defined in the editorSketch function or Editor component
// This allows the editor component, and the p5 sketch to communicate
var updateSelectedTool: Function; // Run a function in skecth that does something depending on the current tool
var updateSelectedObject: Function; // Run a function in editorComponent that open a window to edit the object
var setSelectedObject: Function; // Update the selectedObject in p5 sketch
var loadObjectStackFromStorage: Function; // Function in p5js sketch to load objects from localStorage to objectStack
var history = <any>{};

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit, OnDestroy {
  private p5;
  _history;
  _selectedTool: Tools;
  objectStack: ShapeClass[] = objectStack; // Bind EditorComponet.objectStack to the global objectStack
  objectThatShouldBeEdited: ShapeClass; // Store the object that is currently being edited (Very creative variable name)

  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet) { }

  // Rearange the objectStack when it is being changed in the html
  drop(event: CdkDragDrop<ShapeClass[]>) {
    moveItemInArray(this.objectStack, event.previousIndex, event.currentIndex);
  }

  objectStackClickHandler(id: number) {
    setSelectedObject(id); // Inform the editor sketch that an object has been selected
  }

  changeTool(e: Tools) {
    selectedTool = e;
    updateSelectedTool(e);
  }

  saveCode() {
    isCodeSaved = true;

    // If the sketch doesn't have a name, prompt the user
    if(!sketchName) sketchName = prompt('Name this sketch') || new Date().getTime() + '';

    // Load the savedSketches as an array from localStorage
    const savedSketches = localStorage.getItem('savedSketches') || '[]';

    var parsedSketches = JSON.parse(savedSketches); // Parse the saved sketches
    var parsedSketches = parsedSketches.map(e => JSON.parse(e)); // Parse the children of the saved sketches

    var doesSketchExist = false;
    // Loop through the parsed sketches and see if any matches
    // If one does match, replace the saved sketch with the new sketch
    // If the sketch is not saved before, just save the sketch as a new sketch
    parsedSketches.forEach((sketch, index) => {
      if(sketch.name == sketchName) {
        parsedSketches[index] = {
          name: parsedSketches[index].name,
          date: new Date().getTime(),
          objectstack: objectStack.map(object => object.toString())
        }
        doesSketchExist = true;
      }

      parsedSketches[index] = JSON.stringify(parsedSketches[index]);
    });

    if(!doesSketchExist) {
      parsedSketches.push(JSON.stringify({
        name: sketchName,
        date: new Date().getTime(),
        objectstack: objectStack.map(object => object.toString())
      }));
    }

    // Push the modified saved sketches to local storage
    localStorage.setItem('savedSketches', JSON.stringify(parsedSketches));
    
  }

  openSettings() {
    function updateSettings(key, value) {
      // Do something
      console.log(key, value);
    }

    var settingBottomSheet = this._bottomSheet.open(SettingsComponent, {
      data: {
        updateSettings,
      },
      panelClass: 'bottom-sheet'
    });
  }

  // Test function to compile into GMOD
  compile() {
    const dialogRef = this.dialog.open(CompilerOutputComponent, {
      width: '800px',
      data: compile(objectStack)
    });
    isEditorPaused = true; // Pause the editor

    dialogRef.afterClosed().subscribe(() => {
      isEditorPaused = false;
    });
  }

  ngOnInit() {
    // Create the canvas when the component is created
    this.createCanvas();
    this._selectedTool = selectedTool
    // Object that stores functions related to history
    this._history = history; // Bind EdtiorComponent._history to the global object history

    updateSelectedObject = (object: ShapeClass, callback: Function) => {
      if (!object) { this.objectThatShouldBeEdited = undefined; return; }
      this.objectThatShouldBeEdited = object; // Copy the old object to a new var so i don't have to reassign the function arguments
    }

    // If saved files exist in localStorage, ask the user to create a sketch from one of them
    if(localStorage.getItem('savedSketches') && !sketchName) {
      var bottomSheet = this._bottomSheet.open(SavedSketchesComponent);
      bottomSheet.afterDismissed().subscribe(sketch => loadObjectStackFromStorage(sketch))
    }

    // Run a function before the windows is closed, or reloaded
    window.onbeforeunload = (event) => {
      if(isCodeSaved) return;

      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = '';
    };
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
    var tempObject: ShapeClass = undefined; // Object to store tempporary information, such as shape, color and position
    // when an object is changed the old version of the object is added to the historyArray
    var historyArray: IShapeChanges[] = []; // Stack to hold the history of all object
    var selectedObject: number; // Number to store a selected objects index in the objectStack
    var mouse = { x: 0, y: 0 }; // Object to contain the x, y position of the mouse
    var canvas; // p5 canvas

    // Define the global function, this allows the editorComponent to tell the sketch when the selectedTool changes
    // And run on function depending on what tool is selected
    updateSelectedTool = (tool: Tools) => {
      // Deselect the currently selected object, if a tool that isn't select is selected
      if (tool !== "select") { deselectObject(); selectedObject = undefined }
    }

    function escapeIfMouseIsOutside() {
      return (
        p.mouseX > p.width ||
        p.mouseX < 0 ||
        p.mouseY > p.height ||
        p.mouseY < 0
      );
    }

    function deselectObject() {
      // Loop through the objectStack and find the selected object
      objectStack.forEach(object => {
        // If the object is found, deselect it
        if (object.selected) { object.selected = false; }
      });
    }

    p.setup = () => {
      canvas = p
        .createCanvas(window.innerWidth / 2.5, window.innerWidth / 2.5)
        .parent("editor-canvas");
      canvas.style("border", "solid 0.5px black");
      p.angleMode(p.DEGREES);
      p.ellipseMode(p.CORNER);
      p.background(255, 175, 175);
    };

    p.draw = () => {
      p.background(255);
      p.strokeWeight(0.5);

      // Draw every object in the object stack
      objectStack.forEach((object, index) => {
        object.display(); // Call display function on the object, rendering happens in the class
      });

      // Draw tempObject on top of every thing else
      if (tempObject) {
        tempObject.display(); // Call display in the tempObject. If it exist
      }

      // Other stuff that happens every time the screen refreshes
    };

    function updateMouseCords() {
      // Update the mouse object everytime the mouse moves
      // Should happen before any other mouse function
      mouse.x = Math.min(Math.max(p.mouseX, 0), p.width); // Limits mouse.x to inside the screen
      mouse.y = Math.min(Math.max(p.mouseY, 0), p.height); // Limits mouse.y to inside the screen
    }

    p.mouseMoved = () => { updateMouseCords(); }
    p.mouseDragged = () => {
      if(isEditorPaused) return; // Don't respond to mouse clicks if the editor is paused

      // If an object is selected, call the drag function on it
      // Don't do it no object is selected, or if the mouse is outside the canvas
      if(typeof selectedObject === 'number' && !escapeIfMouseIsOutside()) {
        objectStack[selectedObject].drag();
      }

      updateMouseCords();
    };

    p.mousePressed = () => {
      if(isEditorPaused) return; // Don't respond to mouse clicks if the editor is paused

      if(!escapeIfMouseIsOutside) { isCodeSaved = false; } // If there is a click inside the sketch, change the isCodeSaved to false

      // Only create a new object if the selected tool isn't select
      if (selectedTool !== "select") {
        if(!escapeIfMouseIsOutside()) {
          deselectObject();
          selectedObject = undefined;
          updateSelectedObject(undefined);
        }

        if (tempObject) {
          // Don't run if tempObject doesn't exist

          // Very bad of implementing this, but i think i'm gonna keep it in
          // Add positions depenging on what shape it is
          if(selectedTool !== "polygon") {
            tempObject.addPos({
              x: mouse.x - tempObject.pos[0].x,
              y: p.keyCode === p.SHIFT ? mouse.x - tempObject.pos[0].x : mouse.y - tempObject.pos[0].y
            });
          } else {
            tempObject.addPos({
              x: p.mouseX,
              y: p.mouseY
            });
          }

          // Only push the shape to the object stack if the shape is complete
          if(tempObject.isComplete) {
            // Push the tempObject to the objectStack
            objectStack.push(tempObject);
  
            // Set the newly created object as selected
            deselectObject() // De-select the current object if a new object is going to be selected
            selectedObject = objectStack.length-1;
            objectStack[objectStack.length-1].selected = true;
            updateSelectedObject(objectStack[objectStack.length-1], editObjectData);
  
            // Push the added object to the historyArray 
            history.pushTohistoryArray({
              changeType: 'add', // Make it an adding type
              objectData: tempObject
            });
  
            // Empty the tempObject so it's ready for a new object
            tempObject = undefined;
          }
        } else {
          if(escapeIfMouseIsOutside()) return; // Escape mouse click if mouse is outside the canvas

          // If tempObject doesn't exist create a tempObject
          switch (selectedTool) {
            case "box":
              tempObject = new EGPObjects.box('box', p, new Date().getTime());
              tempObject.setColor({ r: 255, g: 175, b: 175 }); // Replace with dynamic colors
              tempObject.addPos({ x: mouse.x, y: mouse.y });
              break;

            case "ellipse":
              tempObject = new EGPObjects.ellipse('ellipse', p, new Date().getTime());
              tempObject.setColor({ r: 255, g: 175, b: 175 }); // Replace with dynamic colors
              tempObject.addPos({ x: mouse.x, y: mouse.y });
              break;

            case "polygon":
              tempObject = new EGPObjects.polygon('polygon', p, new Date().getTime());
              tempObject.setColor({ r: 255, g: 175, b: 175 }); // Replace with dynamic colors
              tempObject.addPos({ x: mouse.x, y: mouse.y });
              break;

            default:
              break;
          };
          
        }

      } else { // If the current tool is select
        if(escapeIfMouseIsOutside()) return; // Escape mouse click if mouse is outside the canvas
        // Loop through each object in the object stack, and determine which is clicked on
        // Do a reverse loop to get the object that is draw on top
        var objectFound = false; // If an object is found, change this variable to true
        for (let i = objectStack.length - 1; i >= 0; --i) {
          const object = objectStack[i];
          if (object.clicked()) { // If object.clicked is true set it as the selected object
            deselectObject() // De-select the current object if a new object is going to be selected
            selectedObject = i;
            object.selected = true;
            updateSelectedObject(objectStack[i], editObjectData);
            objectFound = true;

            break; // Break out of the loop when it finds the object that has been clicked on
          } else {
            continue;
          }
        }

        // No object was found in the above for-loop
        // And an object is still selected, then deselect the object
        if (!objectFound && typeof (selectedObject) !== "undefined") { deselectObject(); selectedObject = undefined; updateSelectedObject(undefined) }
      }
    };

    p.mouseReleased = () => { };

    setSelectedObject = (id: number) => {
      // Set the selected object to an object from outside the sektch

      deselectObject(); // De-selected the current object if a new object is going to be selected
      // Loop through the object stack and find the matching object id, then replace the object
      objectStack.forEach((object, index) => {
        if (object.id == id) {
          // Found the right object
          selectedObject = index; //Update the selected object
          objectStack[selectedObject].selected = true; // Set the selected object to true
          updateSelectedObject(objectStack[index], editObjectData); // Send the selected object to the EditorComponent
        };
      });
    }

    function editObjectData(newObject: ShapeClass) {
      // Replace the edited object with the old object in the object stack

      // Loop through the object stack and find the matching object id, then replace the object
      objectStack.forEach((object, index) => {
        if (object.id == newObject.id) {
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

    loadObjectStackFromStorage = (savedSketch) => {
      // If saved files exist in localStorage, ask the user to create a sketch from one of them
      sketchName = savedSketch.name;
      savedSketch.objectstack.forEach((element, index) => {
        const object = JSON.parse(element);
        const newObject = new EGPObjects[object.type](object.type, p, object.id);
        newObject.loadFromMemory(object);
        objectStack[index] = newObject;
      });
    }

    history = {
      pushTohistoryArray: (change: IShapeChanges) => {
        historyArray.unshift(change); // Add the change to the front of the array
        if (historyArray.length > 5) { historyArray.pop(); } // If the historyArray has more than 5 changes in it
      },

      undo: () => {
        if (historyArray.length == 0) return; // Escape function if historyArray is empty
        // Variable to store the change, and remove it from the historyArray
        let change: IShapeChanges = historyArray.shift();

        // Switch the changeType
        switch (change.changeType) {
          case 'edit':
            // ChangeType is an edit change
            // Replace the changed object with the old object

            // Loop through the objectStack and find the object that was changed
            objectStack.forEach((object, index) => {
              if (object.id == change.objectData.id) {
                // Found the right object

                // Revert the oject to the older object stored in the historyArray
                objectStack[index] = change.objectData;
              };
            });
            break;

          case 'add':
            // ChangeType is an adding change
            // Remove the added object from the objectStack

            // Loop through the objectStack and find the object that was added
            objectStack.forEach((object, index) => {
              if (object.id == change.objectData.id) {
                // Found the right object

                // Remove the object
                objectStack.splice(index, 1);
              };
            });
          default:
            break;
        }
      }
    }
  }
}
