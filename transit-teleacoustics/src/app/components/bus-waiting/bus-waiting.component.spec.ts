import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusWaitingComponent } from './bus-waiting.component';

describe('BusWaitingComponent', () => {
  let component: BusWaitingComponent;
  let fixture: ComponentFixture<BusWaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusWaitingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
