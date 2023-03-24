import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  constructor(private router: Router,public api_service: ApiServiceService,
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
    // this.getdefaultaddress(this.logtoken);
    this.getUserProfile();
  }

  getUserProfile() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('response',response);
          this.spinnerService.hide();
          console.log(response.data);

          if (response.type == 'tokenexpire') {
            this.router.navigateByUrl('/')
              .then(() => {
                localStorage.clear();
                window.location.reload();
              });
          }
          if(response.data.user_type == 1){
            this.getdefaultaddress(this.logtoken);
          }

        },
        (error) => {
          this.spinnerService.hide();
          /*this.snackBar.open('Internal server error', 'End now', {
            duration: 5000,
          });*/
        });
  }
  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      console.log('Default Address responce ====> ', response.data);
      if (!response.success) {
        this.router.navigateByUrl('/my-address-add').then(() => {
          window.location.reload();
        })
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }
}
