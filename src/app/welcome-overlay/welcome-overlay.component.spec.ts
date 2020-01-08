import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeOverlayComponent } from './welcome-overlay.component';

describe('WelcomeOverlayComponent', () => {
  let component: WelcomeOverlayComponent;
  let fixture: ComponentFixture<WelcomeOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
