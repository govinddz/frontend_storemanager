import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GeoApiService} from '../core/services/geo-api.service';
import {AddNewDeatilService} from '../core/services/add-new-deatil.service';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-create-new-shop',
  templateUrl: './create-new-shop.component.html',
  styleUrls: ['./create-new-shop.component.scss']
})
export class CreateNewShopComponent implements OnInit {
  @Output() addNewShopDetailEmitter = new EventEmitter<string>();
  @ViewChild('modalBox', {static: true}) modalBox;
  createNewShopForm: FormGroup;
  addressList: Array<any>;
  addressCoordinate: any;
  addressValue: Array<any>;
  city: any;
  state: any;
  country: any;
  addressCm: any;
  selectedAddress: any;
  success: boolean;
  message: any;
  isToast: boolean;

  constructor(private fb: FormBuilder, private geoloaction: GeoApiService, private addNewDetailService: AddNewDeatilService) { }

  ngOnInit(): void {
    this.addressValue = [];
    this.addressList = [];
    this.addNewDetail();
  }

  closeModal(): void {
    this.createNewShopForm.reset();
    this.modalBox.nativeElement.click();
  }

  /**
   * Create Form for add new Shop Data
   */
  addNewDetail(): any {
    this.createNewShopForm = this.fb.group({
      shopName: ['', [Validators.required]],
      ownerName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  get shopName(): any {return this.createNewShopForm.get('shopName'); }
  get ownerName(): any {return this.createNewShopForm.get('ownerName'); }
  get category(): any {return this.createNewShopForm.get('category'); }
  get address(): any {return this.createNewShopForm.get('address'); }

  addNewShop(): void {
    const payload = {
      "address": {
        "address": this.addressCm ? this.addressCm : '',
        "city": this.city ? this.city : '',
        "country": this.country,
        "latitude": this.addressCoordinate.lat,
        "longitude": this.addressCoordinate.lng,
        "state": this.state
      },
      "category": this.createNewShopForm.get('category').value,
      "ownerName": this.createNewShopForm.get('ownerName').value,
      "shopName": this.createNewShopForm.get('shopName').value
    };

    this.addNewDetailService.addNewShopDetail(payload).subscribe((res) => {
      this.addNewShopDetailEmitter.emit(res);
      this.closeModal();
      this.isToast = true;
      this.success = true;
      this.message = 'Successfully created.';
      setTimeout(() => {
        this.isToast = false;
      }, 2000);
    });
  }

  /**
   * Call GEOLOCATION APIs for get address list
   * @type {get}
   */
  getAddressList(event): any{
    const userInput = event.target.value;
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

  /**
   * Select Address as dropdown and get all data we needed to set into payload
   * City
   * State
   * Country
   */
  selectAddress(addressValue): void{
    this.addressList.forEach((data) => {
      if (data.types[0] === 'locality'){
        this.city = data.long_name;
      }
      if (data.types[0] === 'administrative_area_level_1'){
        this.state = data.long_name;
      }
      if (data.types[0] === 'country'){
        this.country = data.long_name;
      }
      if (data.types[0] === 'political'){
        this.addressCm = data.long_name;
      }
    });
    this.createNewShopForm.patchValue({address: this.addressValue});
    this.selectedAddress = this.addressValue;
    this.addressValue = [];
  }

  closeToast(): void {
    this.isToast = false;
  }

}
