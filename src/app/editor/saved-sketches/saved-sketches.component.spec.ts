import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSketchesComponent } from './saved-sketches.component';

describe('SavedSketchesComponent', () => {
  let component: SavedSketchesComponent;
  let fixture: ComponentFixture<SavedSketchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedSketchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSketchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
