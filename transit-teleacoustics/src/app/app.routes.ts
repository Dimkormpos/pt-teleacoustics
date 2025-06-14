import { Routes } from '@angular/router';
import { VoiceCommandInputComponent } from './components/voice-command-input/voice-command-input.component';
import { TesterComponent } from './tester/tester.component';
import { NextStopLocatorComponent } from './components/next-stop-locator/next-stop-locator.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { BusWaitingComponent } from './components/bus-waiting/bus-waiting.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: BusListComponent
    },
    {
        path: 'voice-input',
        component: VoiceCommandInputComponent
    },
    {
        path: 'tester',
        component: TesterComponent
    },
    {
        path: 'next-stop',
        component: NextStopLocatorComponent
    },
    {
        path: 'bus-waiting',
        component: BusWaitingComponent
    }
];
