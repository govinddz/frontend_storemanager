import {Component, OnInit, ViewChild} from '@angular/core';
import {AddNewDeatilService} from './core/services/add-new-deatil.service';
import {GeoApiService} from './core/services/geo-api.service';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('checked', {static: true}) checked;
  @ViewChild('modalBox', {static: true}) modalBox;
  shopList: Array<any>;
  shopListTemp: Array<any>;
  addressList: Array<any>;
  addressValue: Array<any>;
  addressCoordinate: any;
  totalPage: number;
  isShow: boolean;
  pageNumber: number;
  pageSize: number;
  locationInput: any;
  isDisabled: boolean;

  constructor(private addNewDetail: AddNewDeatilService, private geoloaction: GeoApiService) {}

  ngOnInit(): void {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.shopList = [];
    this.shopListTemp = [];
    this.addressValue = [];
    this.getAllShopList();
    this.locationInput = '';
    this.isDisabled = true;
  }



  getAllShopList(): void {
    const payload = {
      "location": {
      "latitude": this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : null,
        "longitude": this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : null
    },
      "shopName": this.locationInput
    };
    /**
     * Set pagination
     */
    this.addNewDetail.getShopDetails(payload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListTemp = res.content;
      this.totalPage = res.totalPages;
    });
  }
  /**
   * get previous page data
   */
  prev(): void {
    const payload = {
      "location": {
        "latitude": this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : null,
        "longitude": this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : null
      },
      "shopName": this.locationInput
    };
    this.pageNumber -= 1;
    this.addNewDetail.getShopDetails(payload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListTemp = res.content;
    });
  }
  /**
   * get next page data
   */
  next(): void {
    const payload = {
      "location": {
        "latitude": this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : null,
        "longitude": this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : null
      },
      "shopName": this.locationInput
    };
    this.pageNumber += 1;
    this.addNewDetail.getShopDetails(payload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListTemp = res.content;
    });
  }

  searchShopByName(searchUserInput): void {
    this.pageNumber = 0;
    this.pageSize = 1;
    const payload = {
      'location': {
        'latitude': this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : null,
        'longitude': this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : null
      },
      'shopName': searchUserInput.value
    };
    this.addNewDetail.getShopDetails(payload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListTemp = res.content;
    });
  }

  searchShops(event): void {
    this.isDisabled = event.target.value === '';
    const userInput = event.target.value;
    this.locationInput = userInput;
    this.geoloaction.getGeoLocationData(userInput).subscribe((res) => {
        this.addressList = res.results[0].address_components;
        this.addressValue = res.results[0].formatted_address;
        this.addressCoordinate = res.results[0].geometry.location;
      },
      (err) => {
        this.addressValue = [];
        this.addressList = [];
      });
  }

  resetSearch(searchUserInput, inputNearByValue): void {
    this.pageSize = 10;
    this.pageNumber = 0;
    this.addressCoordinate = null;
    this.locationInput = '';
    searchUserInput.value = '';
    inputNearByValue.value = '';
    this.isShow = false;
    this.checked.nativeElement.click();
    this.getAllShopList();
  }

  selectAddress(addressValue, inputNearByValue): void{
    inputNearByValue.value = addressValue;
    this.addressValue = [];
  }

  toggleInput(event): void {
    this.isShow = !!event.target.checked;
    this.isDisabled = event.target.value === '';
  }

  addNewShopDetailIem(newShop): void {
    // this.shopListTemp.unshift(newShop);
    this.pageSize = 10;
    this.pageNumber = 0;
    this.addressCoordinate = null;
    this.locationInput = '';
    this.getAllShopList();
  }

  disabledSearch(searchUserInput): void {
  this.isDisabled = searchUserInput.value === '';
}

  closeModal(): void {
    this.modalBox.nativeElement.click();
  }

}
