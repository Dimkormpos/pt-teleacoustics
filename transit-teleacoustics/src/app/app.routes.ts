import { Routes } from '@angular/router';
import { PrismNavigatorComponent } from './components/prism-navigator/prism-navigator.component';
import { VoiceCommandInputComponent } from './components/voice-command-input/voice-command-input.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: PrismNavigatorComponent
    },
    {
        path: 'voice-input',
        component: VoiceCommandInputComponent
    }
];
