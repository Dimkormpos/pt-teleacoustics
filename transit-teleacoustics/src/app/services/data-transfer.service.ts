import { Injectable } from '@angular/core';
import { Route, Stop } from './oasa-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private currentBusRouteData: Route | undefined;
  private currentStop: Stop | undefined;

  constructor() { }

  public setSelectedBusRoute(input: Route) {
    this.currentBusRouteData = input;
  }

  public getSelectedBusRoute(): Route | undefined {
    return this.currentBusRouteData;
  }

  public setCurrentStop(input: Stop) {
    this.currentStop = input;
  }

  public getCurrentStop(): Stop | undefined {
    return this.currentStop;
  }
}
