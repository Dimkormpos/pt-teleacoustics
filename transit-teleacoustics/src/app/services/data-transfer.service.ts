import { Injectable } from '@angular/core';
import { Route, Stop } from './oasa-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  public currentBusRouteData: Route | undefined;
  public currentStop: Stop | undefined;

  constructor() { }

  public setSelectedBusRoute(input: Route) {
    this.currentBusRouteData = input;
  }

  public getSelectedBusRoute() {
    return this.currentBusRouteData;
  }

  public setCurrentStop(input: Route) {
    this.currentBusRouteData = input;
  }

  public getcurrentStop() {
    return this.currentBusRouteData;
  }
}
