import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voice-command-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './voice-command-input.component.html',
  styleUrl: './voice-command-input.component.css'
})
export class VoiceCommandInputComponent implements OnInit {
transcript: string = '';
isListening: boolean = false;
recognition: any | null = null;

/**
 *
 */
constructor(private ngZone: NgZone) {
}
  ngOnInit(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      alert('Η αναγνώριση φωνής δεν υποστηρίζεται στο πρόγραμμα περιήγησης.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'el-GR';
    this.recognition.interimResults = true;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.ngZone.run(() => {
        this.isListening = true;
        console.log('🎤 Listening...');
      });
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        interimTranscript += event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.ngZone.run(() => {
            this.transcript = interimTranscript.trim();
            this.isListening = false;
            console.log('✅ Final result:', this.transcript);

            this.recognition.stop(); // 💥 Force stop on final result

            this.speak('Το αποτέλεσμα είναι: ' + this.transcript);
          });
        } else {
          this.ngZone.run(() => {
            this.transcript = interimTranscript.trim();
          });
        }
      }
    };


    this.recognition.onerror = (event: any) => {
      this.ngZone.run(() => {
        this.isListening = false;
        console.error('Speech recognition error', event);
        this.speak('Παρουσιάστηκε σφάλμα');
      });
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => {
        this.isListening = false;
      });
    };
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.transcript = ''; // Reset if needed
      this.recognition.start();
    }
  }

  speak(message: string): void {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'el-GR';
    window.speechSynthesis.speak(utterance);
  }
}
