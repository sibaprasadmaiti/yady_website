import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';


@Component({
  selector: 'app-sr-address-edit',
  templateUrl: './sr-address-edit.component.html',
  styleUrls: ['./sr-address-edit.component.css']
})
export class SrAddressEditComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	addressForm: FormGroup;
	address_type;
	edit_id;
	infoMessage;
	infoMessageRed;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService,private route: ActivatedRoute) {

					this.addressForm = formbuilder.group({
						street_address: ['',Validators.compose([Validators.required])],
						city: [''],
						state: [''],
						zip_code: [''],
						lattitude: [''],
						longitude: [''],
						address_type : [''],
						house_no : [''],
						land_mark: ['']
					});

				}

	ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null) {
			this.router.navigateByUrl('/')
				.then(() => {
					localStorage.clear();
				window.location.reload();
			});
		}
		this.route.params.subscribe(params => {
			this.edit_id = params.address_id;
		});
		this.spinnerService.show();
		this.api_service.HttpGetReq(`website/addressById/?token=${this.logtoken}&address_id=${this.edit_id}`, true)
		  .then(
			(response: any) => {
				//console.log('response',response);
			  this.spinnerService.hide();
			  console.log(response.data);

				if(response.type == 'tokenexpire') {
					this.router.navigateByUrl('/')
						.then(() => {
						localStorage.clear();
						window.location.reload();
					});
				}

				this.addressForm.patchValue({
					street_address: response.data.street_address,
					city: response.data.city,
					state: response.data.state,
					zip_code: response.data.zip_code,
					lattitude: response.data.lattitude,
					longitude: response.data.longitude,
					address_type: response.data.address_type,
					house_no: response.data.house_no,
					land_mark: response.data.land_mark
				});
				this.address_type = response.data.address_type;
			},
			(error) => {
			  this.spinnerService.hide();
			}
        );

        this.srGetNewNotification();
	}

	updateAddress()
	{
		var lattitude = (<HTMLInputElement>document.getElementById('lat')).value;
		var longitude = (<HTMLInputElement>document.getElementById('long')).value;
		var street_address = (<HTMLInputElement>document.getElementById('street_address')).value;
		var house_no = (<HTMLInputElement>document.getElementById('house_no')).value;
		var city = (<HTMLInputElement>document.getElementById('city')).value;
		var state = (<HTMLInputElement>document.getElementById('state')).value;
		var zip_code = (<HTMLInputElement>document.getElementById('zip_code')).value;

		if(lattitude == '' || longitude == '')
		{
			alert('Please select a valid address');
			return false;
		}
		if(this.addressForm.value.address_type == '' || this.addressForm.value.address_type == 0)
		{
			alert('Please select address type');
			return false;
		}
		if(street_address == '' || street_address == null)
		{
			alert('Please select a valid address');
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
					land_mark: this.addressForm.value.land_mark,
					address_id: this.edit_id
				};

		//console.log(address_data); return false;

		this.api_service.HttpPostReqHeader('website/updateAddress',address_data,true,this.logtoken).then((response:any)=>{
        if(response.success == true){
                this.spinnerService.hide();
				this.infoMessage = response.message;
				setTimeout(()=>{
					this.infoMessage = "";
				}, 3000);
				this.router.navigateByUrl(`/my-address-list`)
					.then(() => {
					window.location.reload();
				});
              }
              else{
                this.spinnerService.hide();
				 this.infoMessageRed = response.message;
				 setTimeout(()=>{
					this.infoMessageRed = "";
				}, 5000);
              }
		})
	}

  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          console.log('sr get new notification response => ', response);
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
      console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.srNewNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
