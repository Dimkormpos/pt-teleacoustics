import { Routes } from '@angular/router';
import { PrismNavigatorComponent } from './components/prism-navigator/prism-navigator.component';
import { VoiceCommandInputComponent } from './components/voice-command-input/voice-command-input.component';
import { TesterComponent } from './tester/tester.component';
import { NextStopLocatorComponent } from './components/next-stop-locator/next-stop-locator.component';
import { BusListComponent } from './components/bus-list/bus-list.component';

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
    }
];
