import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-sr-address-add',
  templateUrl: './sr-address-add.component.html',
  styleUrls: ['./sr-address-add.component.css']
})
export class SrAddressAddComponent implements OnInit {

  logtoken = localStorage.getItem('LoginToken');
  addressForm: FormGroup;
  infoMessage = "";
  infoMessageRed = "";
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  zip_code;
  state;
  city;
  house_no;
  submitted = false;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {

    this.addressForm = formbuilder.group({
      street_address: ['', Validators.compose([Validators.required])],
      city: [''],
      state: [''],
      zip_code: [''],
      lattitude: [''],
      longitude: [''],
      address_type: [''],
      house_no: [''],
      land_mark: ['']
    });

  }

  ngOnInit() {
    this.srGetNewNotification();
  }

  getCurrentLocation() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });

      /*var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };*/

      /*function success(pos) {

        var crd = pos.coords;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        var lat = crd.latitude;
        var long = crd.longitude;
        getAddress(lat, long);

      }*/
      /*function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }*/

      //navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log('aaa', results[0]);
          this.zoom = 12;
          this.address = results[0].formatted_address;
          //console.log(this.address);
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] == "postal_code") {
                //console.log('zip code',results[0].address_components[i].long_name);
                this.zip_code = results[0].address_components[i].long_name;
              }
            }
          }
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] == "administrative_area_level_1") {
                this.state = results[0].address_components[i].long_name;
              }
            }
          }
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] == "administrative_area_level_2") {
                this.city = results[0].address_components[i].long_name;
              }
            }
          }
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] == "premise") {
                this.house_no = results[0].address_components[i].long_name;
              }
            }
          }
          this.addressForm.patchValue({
            street_address: this.address,
            zip_code: this.zip_code,
            lattitude: latitude,
            longitude: longitude,
            state: this.state,
            city: this.city,
            house_no: this.house_no,
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  addAddress() {
    //console.log(this.addressForm.value); return false;
    var lattitude = (<HTMLInputElement>document.getElementById('lat')).value;
    var longitude = (<HTMLInputElement>document.getElementById('long')).value;
    var street_address = (<HTMLInputElement>document.getElementById('street_address')).value;
    var house_no = (<HTMLInputElement>document.getElementById('house_no')).value;
    var city = (<HTMLInputElement>document.getElementById('city')).value;
    var state = (<HTMLInputElement>document.getElementById('state')).value;
    var zip_code = (<HTMLInputElement>document.getElementById('zip_code')).value;

    if (lattitude == '' || longitude == '') {
      alert('Please select a valid address');
      return false;
    }
    if (this.addressForm.value.address_type == '' || this.addressForm.value.address_type == 0) {
      alert('Please select address type');
      return false;
    }
    if (street_address == '' || street_address == null) {
      alert('Please select a valid street address');
      return false;
    }

    var address_data = {
      street_address: street_address,
      city: city,
      state: state,
      zip_code: zip_code,
      lattitude: lattitude,
      longitude: longitude,
      address_type: this.addressForm.value.address_type,
      house_no: house_no,
      land_mark: this.addressForm.value.land_mark
    };

    console.log(address_data); return false;

    // this.api_service.HttpPostReqHeader('website/saveAddress',address_data,true,this.logtoken).then((response:any)=>{
    //     if(response.success == true){
    //             this.spinnerService.hide();
    // 		this.infoMessage = response.message;
    // 		setTimeout(()=>{
    // 			this.infoMessage = "";
    // 		}, 3000);
    // 		this.router.navigateByUrl(`/my-address-list`)
    // 			.then(() => {
    // 			window.location.reload();
    // 		});
    //           }
    //           else{
    //             this.spinnerService.hide();
    // 		 this.infoMessageRed = response.message;
    // 		 setTimeout(()=>{
    // 			this.infoMessageRed = "";
    // 		}, 5000);
    //           }
    // })
  }

  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('sr get new notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.srNewNotification = response.data;
          } else {
            this.spinnerService.hide();
            this.srNewNotification = response.data;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.srNewNotification = false;
        });
  }

  srReadNotification() {
    this.api_service.HttpPostReqHeader('website/srReadNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.srNewNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
