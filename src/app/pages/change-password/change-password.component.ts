import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  logtoken = localStorage.getItem('LoginToken');
  error_msg = "";
  infoMessage = "";
  userType;
  newNotification = false;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService,
    private translateService: TranslateService) {
    this.passwordForm = formbuilder.group({
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });
  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.getUserProfile();
    }
  }
  getUserProfile() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          if (response.type == 'tokenexpire') {
            this.router.navigateByUrl('/')
              .then(() => {
                localStorage.clear();
                window.location.reload();
              });
          }
          this.userType = response.data.user_type;
          if(response.data.user_type == 1){
            this.getdefaultaddress(this.logtoken);
            this.srGetNewNotification();
          }else{
            this.getNewNotification();
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
      if (!response.success) {
        this.router.navigateByUrl('/my-address-add').then(() => {
          window.location.reload();
        })
      } else {


      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  updatePassword() {
    //console.log(this.passwordForm.value.old_password); return false;
    if (this.passwordForm.value.new_password != this.passwordForm.value.confirm_password) {
      this.error_msg = this.translateService.instant('New Password and Confirm Password does not match');
      return false;
    }
    this.spinnerService.show();
    let formValue = this.passwordForm.value;
    this.api_service.HttpPostReqHeader('website/changePassword', formValue, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.router.navigateByUrl('/')
            .then(() => {
              localStorage.clear();
              window.location.reload();
            });
        }, 4000);

      }
      else {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        //this.toastr.error('Internal server error');
        /*this.snackBar.open(response.message, 'End now', {
          duration: 5000,
        });*/
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

}
