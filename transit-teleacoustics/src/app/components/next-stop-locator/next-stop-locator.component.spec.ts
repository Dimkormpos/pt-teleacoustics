import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextStopLocatorComponent } from './next-stop-locator.component';

describe('NextStopLocatorComponent', () => {
  let component: NextStopLocatorComponent;
  let fixture: ComponentFixture<NextStopLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextStopLocatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextStopLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
