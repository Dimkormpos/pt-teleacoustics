import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismNavigatorComponent } from './prism-navigator.component';

describe('PrismNavigatorComponent', () => {
  let component: PrismNavigatorComponent;
  let fixture: ComponentFixture<PrismNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrismNavigatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrismNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
