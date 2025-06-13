import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OasaApiService {
  private readonly BASE_URL = 'https://telematics.oasa.gr/api';

  constructor(private _http: HttpClient) { }

  /**
   * Gets bus arrival information for a specific stop and route.
   * @param stopCode e.g. "060153"
   * @param routeCode e.g. "0600"
   */
  getStopArrivals(stopCode: string, routeCode: string): Observable<any> {
    const url = `${this.BASE_URL}/?act=getStopArrivals&p1=${stopCode}&p2=${routeCode}`;
    return this._http.get(url);
  }

  /**
   * Gets all bus lines
   */
  getLines(): Observable<any> {
    return this._http.get(`${this.BASE_URL}/?act=getLines`);
  }

  /**
   * Gets all stops for a specific route
   * @param routeCode e.g. "0600"
   */
  getStopsForRoute(routeCode: string): Observable<any> {
    const url = `${this.BASE_URL}/?act=getStops&p1=${routeCode}`;
    return this._http.get(url);
  }

  /**
   * Gets vehicle locations for a specific route
   * @param routeCode e.g. "0600"
   */
  getVehiclesForRoute(routeCode: string): Observable<any> {
    const url = `${this.BASE_URL}/?act=getVehicles&p1=${routeCode}`;
    return this._http.get(url);
  }
  /**
   * Gets the closest bus stops to the provided latitude and longitude.
   * @param latitude Latitude in decimal degrees
   * @param longitude Longitude in decimal degrees
   */
  getClosestStops(latitude: number, longitude: number): Observable<any> {
    const url = `${this.BASE_URL}/?act=getClosestStops&p1=${latitude}&p2=${longitude}`;
    return this._http.get(url);
  }
  /**
   * Gets the real-time location of a specific bus by vehicle ID.
   * @param vehicleId The ID of the vehicle (e.g. "2106")
   */
  getBusLocation(vehicleId: string): Observable<any> {
    const url = `${this.BASE_URL}/?act=getBusLocation&p1=${vehicleId}`;
    return this._http.get(url);
  }
}
