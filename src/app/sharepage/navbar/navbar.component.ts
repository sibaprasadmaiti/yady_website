import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	firstlattere:any;
	logtoken = localStorage.getItem('LoginToken');
	first_name = localStorage.getItem('first_name');

	last_name = localStorage.getItem('last_name');
	//Firstlatterelastname = this.last_name.substring(0, 1)
	//user_type = localStorage.getItem('user_type');
	public login_exists;
	userType;
  userDetails: any;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

	ngOnInit() {
		console.log("login token ....",this.logtoken);
		if(this.logtoken!='' && this.logtoken!= undefined && this.logtoken!= null)
		{
			this.login_exists = 'a';

      //this.getdefaultaddress(this.logtoken);
      this.	getUserDetails();
		}
		else
		{
			console.log('xxxx');
			this.login_exists = 'b';
		}
		this.firstlattere = this.first_name?this.first_name.substring(0, 6):'';
	}

	logOut(){
		localStorage.clear();
		this.router.navigate(['/'])
		.then(() => {
			window.location.reload();
		});
	}

	// getUserDetails() {
	// 	this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
  //     .then(
  //       (response: any) => {
	// 	  console.log('rahul',response.data);
	// 	  this.userType = response.data.user_type;
  //       },
  //       (error) => {
  //         this.spinnerService.hide();

  //       });
	// }

  getUserDetails() {
		this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
			//console.log('user profile details response', response);
			//console.log('rahul',response.data);
			if(response.success == true) {
        this.userDetails = response.data;
				this.userType = response.data.user_type;
			} else {
				localStorage.clear();
				this.router.navigateByUrl('/')
					.then(() => {
					window.location.reload();
				});
			}
        },
        (error) => {
          this.spinnerService.hide();

        });
	}

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if(response.success){
       // console.log(this.router.url);
        this.getUserDetails();
      }else{
        if(this.router.url !='/my-address-add'){
          this.router.navigateByUrl('/my-address-add').then(() =>{
            window.location.reload();
          })
        }

      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  onImgError(event){
    event.target.src = '/assets/images/no-image.jpg';
   //Do other stuff with the event.target
   }
}
