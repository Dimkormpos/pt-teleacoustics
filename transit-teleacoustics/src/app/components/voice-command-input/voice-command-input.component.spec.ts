import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceCommandInputComponent } from './voice-command-input.component';

describe('VoiceCommandInputComponent', () => {
  let component: VoiceCommandInputComponent;
  let fixture: ComponentFixture<VoiceCommandInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceCommandInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceCommandInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
