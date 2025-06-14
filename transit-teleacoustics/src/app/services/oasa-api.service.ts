import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OasaApiService {
  private readonly BASE_URL = '/api';

  constructor(private _http: HttpClient) { }

  /**
   * Gets bus arrival information for a specific stop and route.
   * @param stopCode e.g. "060153"
   */
  getStopArrivals(stopCode: string): Observable<StopArrival[]> {
    const url = `${this.BASE_URL}/?act=getStopArrivals&p1=${stopCode}`;
    return this._http.get<any[]>(url).pipe(
      map(items =>
        items.map(item => ({
          routeCode: item.route_code,
          vehicleCode: item.veh_code,
          minutesUntilArrival: parseInt(item.btime2, 10)
        }))
      )
    );
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
  getClosestStops(latitude: number, longitude: number): Observable<Stop[]> {
    const url = `${this.BASE_URL}/?act=getClosestStops&p1=${latitude}&p2=${longitude}`;
    return this._http.get<Stop[]>(url);
  }

  /**
   * Gets the closest bus stops to the provided latitude and longitude.
   * @param latitude Latitude in decimal degrees
   * @param longitude Longitude in decimal degrees
   */
  getNearestStop(latitude: number, longitude: number): Observable<Stop> {
    return this.getClosestStops(latitude, longitude).pipe(
      map(stops => stops[0]) // return the first (nearest) stop
    );
  }
  /**
   * Gets the real-time location of a specific bus by vehicle ID.
   * @param routeCode The code of the route
   */
  getBusLocations(routeCode: string): Observable<BusLocation[]> {
    return this._http.get<BusLocation[]>(`${this.BASE_URL}/?act=getBusLocation&p1=${routeCode}`);
  }

  webRoutesForStop(stopCode: string): Observable<Route[]> {
    return this._http.get<Route[]>(`${this.BASE_URL}/?act=webRoutesForStop&p1=${stopCode}`).pipe(
      switchMap((t: Route[]) => {
        const routes = t;

        const uniqueRoutes = [];
        const seenLineIDs = new Set();

        for (const route of routes) {
          if (!seenLineIDs.has(route.LineID)) {
            seenLineIDs.add(route.LineID);
            uniqueRoutes.push(route);
          }
        }

        return of(uniqueRoutes);
      }),
    );
  }

  webGetRoutesDetailsAndStops(routeCode: string): Observable<Route[]> {
    return this._http.get<any>(`${this.BASE_URL}/?act=webGetRoutesDetailsAndStops&p1=${routeCode}`);
  }

  webGetStops(routeCode: string): Observable<StopInfo[]> {
    return this._http.get<StopInfo[]>(`${this.BASE_URL}/?act=webGetStops&p1=${routeCode}`);
  }

  webRouteDetails(routeCode: string): Observable<StopInfo[]> {
    return this._http.get<StopInfo[]>(`${this.BASE_URL}/?act=webRouteDetails&p1=${routeCode}`);
  }
}

export interface Stop {
  StopCode: string;
  StopID: string;
  StopDescr: string;
  StopDescrEng: string;
  StopStreet: string;
  StopStreetEng: string | null;
  StopHeading: string;
  StopLat: string;
  StopLng: string;
  distance: string;
}

export interface Route {
  RouteCode: string;
  LineCode: string;
  RouteDescr: string;
  RouteDescrEng: string;
  RouteType: string;
  RouteDistance: string; // in meters, as string — can convert to number if needed
  LineID: string;
  LineDescr: string;
  LineDescrEng: string;
  MasterLineCode: string;
}

export interface BusLocation {
  VEH_NO: string;      // Vehicle number
  CS_DATE: string;     // Date and time as string
  CS_LAT: string;      // Latitude as string (could parse to number if needed)
  CS_LNG: string;      // Longitude as string (could parse to number if needed)
  ROUTE_CODE: string;  // Route code
}

export interface StopInfo {
  RouteStopOrder: string;
  StopAmea: string | null;
  StopCode: string | null;
  StopDescr: string | null;
  StopDescrEng: string | null;
  StopHeading: string | null;
  StopID: string | null;
  StopLat: string;
  StopLng: string
  StopStreet: string | null;
  StopStreetEng: string | null;
  StopType: string | null;
}

export interface BusLocation {
  route_code: string;
  veh_code: string;
  btime2: string;
}

export interface StopArrival {
  routeCode: string;
  vehicleCode: string;
  minutesUntilArrival: number;
}
