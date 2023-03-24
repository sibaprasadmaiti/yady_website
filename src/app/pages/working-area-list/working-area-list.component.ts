import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-working-area-list',
  templateUrl: './working-area-list.component.html',
  styleUrls: ['./working-area-list.component.css']
})
export class WorkingAreaListComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	user_type = Number(localStorage.getItem('user_type'));
	workingAreaData;
	lat: number = 45.464198;
	lng: number = 9.190545;
	latList:any = [];
	longList:any = [];
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService,private mapsAPILoader: MapsAPILoader) { }

    ngOnInit() {
	    if(this.logtoken == '' || this.logtoken == null || this.user_type != 2) {
			this.router.navigateByUrl('/')
				.then(() => {
				localStorage.clear();
				window.location.reload();
			});
		}

		this.getWorkingAreaList();
    this.getNewNotification();
    }

	getWorkingAreaList() {
		this.spinnerService.show();
		this.api_service.HttpGetReq(`website/workingAreaList?token=${this.logtoken}`, true)
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
			this.workingAreaData = response.data;
			for (var i = 0; i < this.workingAreaData.length; i++) {
				//console.log('abc',this.workingAreaData[i]);
				this.latList.push(parseFloat(this.workingAreaData[i].lattitude));
			}
			for (var i = 0; i < this.workingAreaData.length; i++) {
				this.longList.push(parseFloat(this.workingAreaData[i].longitude));
			}
        },
			(error) => {
			  this.spinnerService.hide();
			}
        );
	}

	addNewWorkArea() {
		this.router.navigateByUrl('/working-area-add').then(() =>{
			window.location.reload();
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

  readNotification(){
    this.api_service.HttpPostReqHeader('website/readNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.newNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
