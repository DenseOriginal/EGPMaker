import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectManipulatorComponent } from './object-manipulator.component';

describe('ObjectManipulatorComponent', () => {
  let component: ObjectManipulatorComponent;
  let fixture: ComponentFixture<ObjectManipulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectManipulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectManipulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
