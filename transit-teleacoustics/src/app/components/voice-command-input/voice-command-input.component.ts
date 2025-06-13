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
isListening: boolean = false;
recognition: any | null = null;

ngOnInit(): void {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (SpeechRecognition) {
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'el-GR';
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('🎤 Listening...');
      this.speak('Ξεκίνησε η ακρόαση'); // "Listening started" in Greek
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      this.transcript = result;
      this.isListening = false;
      console.log('Voice Input:', result);
      this.speak('Το αποτέλεσμα είναι: ' + result); // "The result is..."
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      console.error('Speech recognition error', event);
      this.speak('Παρουσιάστηκε σφάλμα'); // "An error occurred"
    };
  } else {
    console.warn('Speech recognition not supported in this browser.');
    alert('Η αναγνώριση φωνής δεν υποστηρίζεται σε αυτό το πρόγραμμα περιήγησης.');
  }
}

startListening(): void {
  if (this.recognition && !this.isListening) {
    this.recognition.start();
  }
}

speak(message: string): void {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'el-GR';
  window.speechSynthesis.speak(utterance);
}

}
