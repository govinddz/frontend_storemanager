import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../base.config';


@Injectable({providedIn: 'root'})
export class AddNewDeatilService {
  constructor(private httpClient: HttpClient) {
  }

  addNewShopDetail(payload): Observable<any> {
    return this.httpClient.post(Constants.createNewShop, payload);
  }

  getShopDetails(payload, pageNumber, pageSize): Observable<any> {
    return this.httpClient.post(Constants.storeShopsDetail + `?pageNumber=${pageNumber}` + `&pageSize=${pageSize}`, payload);
  }

}
