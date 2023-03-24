import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sr-address-list',
  templateUrl: './sr-address-list.component.html',
  styleUrls: ['./sr-address-list.component.css']
})
export class SrAddressListComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	addressData;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

    ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null) {
			this.router.navigateByUrl('/')
				.then(() => {
				localStorage.clear();
				window.location.reload();
			});
		}

    this.getdefaultaddress(this.logtoken);
    this.srGetNewNotification();
    }

    getdefaultaddress(token: any) {
      this.spinnerService.show();
      this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
        this.spinnerService.hide();
        //console.log('Default Address responce ====> ', response.data);
        if (!response.success) {
          this.router.navigateByUrl('/my-address-add').then(() => {
            window.location.reload();
          })
        }else{
          this.getUserAddresses();
        }
      },
        (error) => {
          this.spinnerService.hide();
        }
      );
    }

	getUserAddresses() {
		this.spinnerService.show();
		this.api_service.HttpGetReq(`website/addressList?token=${this.logtoken}`, true)
        .then(
        (response: any) => {
          this.spinnerService.hide();
		  //console.log('c',response.data);
			if(response.type == 'tokenexpire') {
				this.router.navigateByUrl('/')
					.then(() => {
					localStorage.clear();
					window.location.reload();
				});
			}
			this.addressData = response.data;
        },
			(error) => {
			  this.spinnerService.hide();
			}
        );
	}

	addNewAddress() {
		this.router.navigateByUrl('/my-address-add').then(() =>{
			window.location.reload();
		})
	}

	setDefaultAddress(address_id) {
		this.spinnerService.show();
		if(address_id) {
			const addressDetails = {
				address_id: address_id
			}
			this.api_service.HttpPostReqHeader('website/setAddressDefault',addressDetails,true,this.logtoken).then((response:any)=>{
				if(response.success == true){
					this.spinnerService.hide();
					this.getUserAddresses();
				} else{
					this.spinnerService.hide();
				}
			})
		}
	}

	editAddress(address_id) {
		this.router.navigateByUrl('my-address-edit/'+address_id).then(() =>{
			window.location.reload();
		})
	}

	deleteAddress(address_id) {
		this.spinnerService.show();
		if(address_id) {
			const addressDetails = {
				address_id: address_id
			}
			this.api_service.HttpPostReqHeader('website/deleteAddress',addressDetails,true,this.logtoken).then((response:any)=>{
				if(response.success == true){
					this.spinnerService.hide();
					this.getUserAddresses();
				} else{
					this.spinnerService.hide();
				}
			})
		}
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

  srReadNotification(){
    this.api_service.HttpPostReqHeader('website/srReadNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.srNewNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
