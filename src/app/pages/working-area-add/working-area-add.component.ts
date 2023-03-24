import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-working-area-add',
  templateUrl: './working-area-add.component.html',
  styleUrls: ['./working-area-add.component.css']
})
export class WorkingAreaAddComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	user_type = Number(localStorage.getItem('user_type'));
	workAreaForm: FormGroup;
	infoMessage = "";
	infoMessageRed = "";
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) {

					this.workAreaForm = formbuilder.group({
						location: ['',Validators.compose([Validators.required])],
						city: [''],
						state: [''],
						lattitude: [''],
						longitude: ['']
					});
				}

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.user_type != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getNewNotification();
  }

	addWorkArea() {
		var lattitude = (<HTMLInputElement>document.getElementById('lat')).value;
		var longitude = (<HTMLInputElement>document.getElementById('long')).value;
		var location = (<HTMLInputElement>document.getElementById('location')).value;
		var city = (<HTMLInputElement>document.getElementById('city')).value;
		var state = (<HTMLInputElement>document.getElementById('state')).value;

		if(lattitude == '' || longitude == '')
		{
			alert('Please select a valid address');
			return false;
		}
		if(location == '' || location == null)
		{
			alert('Please select a valid address');
			return false;
		}
		this.spinnerService.show();
		var address_data = {
					location: location,
					city: city,
					state: state,
					lattitude: lattitude,
					longitude: longitude
				};

		this.api_service.HttpPostReqHeader('website/spWorkingAreaSave',address_data,true,this.logtoken).then((response:any)=>{
        if(response.success == true){
                this.spinnerService.hide();
				this.infoMessage = response.message;
				setTimeout(()=>{
					this.infoMessage = "";
				}, 3000);
				/*this.router.navigateByUrl(`/my-address-list`)
					.then(() => {
					window.location.reload();
				});*/
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

  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('get new notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.newNotification = response.data;
          } else {
            this.spinnerService.hide();
            this.newNotification = response.data;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.newNotification = false;
        });
  }

}
