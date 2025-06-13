import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voice-command-input',
  imports: [CommonModule],
  templateUrl: './voice-command-input.component.html',
  styleUrl: './voice-command-input.component.css'
})
export class VoiceCommandInputComponent implements OnInit {
  transcript: string = '';
  public recognition: any | null = null;

  ngOnInit(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'el-GR';
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        this.transcript = result;
        console.log('Voice Input:', result);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }

  startListening(): void {
    if (this.recognition) {
      this.recognition.start();
    } else {
      alert('Speech recognition not supported in your browser.');
    }
  }

}
