import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoApiService {

  constructor(private httpClient: HttpClient) {}

  getGeoLocationData(addressInput): Observable<any>{
    let params = new HttpParams();
    params = params.append('address', addressInput);
    params = params.append('key', environment.geoAPIKey);
    return this.httpClient.get(environment.geoAPI, {params});
  }
}
