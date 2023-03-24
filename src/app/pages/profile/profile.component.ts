import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  logtoken = localStorage.getItem('LoginToken');
  user_type = Number(localStorage.getItem('user_type'));
  first_name: any;
  last_name: any;
  email: any;
  mobile_no: any;
  country_code: any;
  only_mobile_no: any;
  userType;
  emailSendButton = false;
  emailReSendButton = true;
  infoMessage = "";
  infoMessageRed = "";
  timeleft: any;
  timeleft2: any;
  emailUpdateForm: FormGroup;
  mobileSendButton = false;
  mobileReSendButton = true;
  mobileUpdateForm: FormGroup;
  newNotification = false;
  srNewNotification = false;
  userProfileData: any;
  profileImage: any;
  profileImageFile: any;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private translateService: TranslateService) {

      this.translateService.setDefaultLang('en');
      this.translateService.use(localStorage.getItem('lang') || 'en');

    this.profileForm = formbuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      email: [''],
      mobile_no: [''],
      user_id: ['']
    });

    this.emailUpdateForm = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])],
      email_otp: ['', Validators.compose([Validators.required])]
    });

    this.mobileUpdateForm = formbuilder.group({
      mobile_no: ['', Validators.compose([Validators.required])],
      mobile_otp: ['', Validators.compose([Validators.required])],
      country_code: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    //console.log('logtoken',this.logtoken);
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.getNewNotification();
      this.getUserProfile();

    }
  }

  getUserProfile() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          console.log('user profile response',response);
          this.spinnerService.hide();
          console.log(response.data);
          // this.translateService.get('Please enter a valid email').subscribe(
          //   msg => alert(msg)
          // )
          if (response.type == 'tokenexpire') {
            this.router.navigateByUrl('/')
              .then(() => {
                localStorage.clear();
                window.location.reload();
              });
          }
          this.userProfileData = response.data;
          this.profileImage = response.data.profile_image;
          this.userType = response.data.user_type;

          this.profileForm.patchValue({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            mobile_no: response.data.mobile_no,
            country_code: response.data.country_code,
            only_mobile_no: response.data.only_mobile_no,
            user_id: response.data.user_id
          });
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

  onImgError(event){
    event.target.src = '/assets/images/no-image.jpg';
   //Do other stuff with the event.target
   }

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        // console.log(this.router.url);
       // this.getUserProfile();
      } else {
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

  imagePreview(event: any) {
    let file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
   // console.log(this.profileForm.value);
    this.spinnerService.show();
    let formValue = this.profileForm.value;
    let form_data = new FormData();
    form_data.append('profile_data', JSON.stringify(formValue));
    form_data.append('profile_image', this.profileImageFile);
    this.api_service.HttpPostReqHeader('website/updateUserProfile', form_data, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        //this.toastr.success(response.message);
        //localStorage.setItem('LoginToken', response.token);
        /*this.snackBar.open(response.message, 'End now', {
          duration: 5000,
        });*/
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

  getEmailOTP(event: any, email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var validate_email = regex.test(email);
    console.log('zzz', validate_email);

    if (validate_email == false) {
      alert('Please enter a valid email');
      // this.translateService.get('Please enter a valid email').subscribe(
      //   msg => alert(msg)
      // );
      return false;
    }
    this.spinnerService.show();
    event.target.disabled = true;
    var emailForm = {
      email: email,
      user_type: this.user_type
    }

    this.api_service.HttpPostReqHeader('website/updateEmail', emailForm, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        let counter = 120;
        const interval = setInterval(() => {
          console.log(counter);
          counter--;
          this.timeleft = counter + ' Seconds';
          if (counter == 0) {
            clearInterval(interval);
            console.log('Ding!');
            this.timeleft = "";
          }
        }, 1000);
        this.infoMessage = response.message;
        this.emailUpdateForm.controls['email_otp'].enable();
        this.emailUpdateForm.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.emailSendButton = true;
          this.emailReSendButton = false;
        }, 120000);
      } else {
        this.spinnerService.hide();
        event.target.disabled = false;
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  resendEmailOTP(event: any, email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var validate_email = regex.test(email);
    console.log('zzz', validate_email);

    if (validate_email == false) {
      alert('Please enter a valid email');
      return false;
    }
    this.spinnerService.show();
    event.target.disabled = true;
    var emailForm = {
      email: email,
      user_type: this.user_type
    }

    this.api_service.HttpPostReqHeader('website/updateEmail', emailForm, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        let counter = 120;
        const interval = setInterval(() => {
          console.log(counter);
          counter--;
          this.timeleft = counter + ' Seconds';
          if (counter == 0) {
            clearInterval(interval);
            console.log('Ding!');
            this.timeleft = "";
          }
        }, 1000);
        this.infoMessage = response.message;
        this.emailUpdateForm.controls['email_otp'].enable();
        this.emailUpdateForm.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.emailSendButton = true;
          this.emailReSendButton = false;
        }, 120000);
      } else {
        this.spinnerService.hide();
        event.target.disabled = false;
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  verifyEmailOTP() {
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const formValue4 = {
      email_otp: this.emailUpdateForm.value.email_otp
    }
    this.api_service.HttpPostReqHeader('website/verifyChangeEmailOTP', formValue4, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        ($('#emailEdit') as any).modal('hide');
        this.emailUpdateForm.reset();
        this.timeleft = "";
        this.getUserProfile();
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  onCountryChange(ev) {
    console.log(ev.dialCode);
    this.mobileUpdateForm.patchValue({
      country_code: ev.dialCode
    });
  }
  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }

  getMobileOTP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';

    this.spinnerService.show();

    const formValue2 = {
      mobile_no: this.mobileUpdateForm.value.mobile_no,
      country_code: '+' + this.mobileUpdateForm.value.country_code
    }
    console.log(formValue2);
    this.api_service.HttpPostReqHeader('website/updateMobileNo', formValue2, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        let counter = 120;
        const interval = setInterval(() => {
          console.log(counter);
          counter--;
          this.timeleft2 = counter + ' Seconds';
          if (counter == 0) {
            clearInterval(interval);
            console.log('Ding!');
            this.timeleft2 = "";
          }
        }, 1000);
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
          this.mobileSendButton = true;
          this.mobileReSendButton = false;
        }, 120000);
        this.mobileUpdateForm.controls['mobile_otp'].enable();
        this.mobileUpdateForm.controls['mobile_no'].disable();
      } else {
        this.spinnerService.hide();
        event.target.disabled = false;
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  resendMobileOTP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();

    const formValue2 = {
      mobile_no: this.mobileUpdateForm.value.mobile_no,
      country_code: '+' + this.mobileUpdateForm.value.country_code
    }
    this.api_service.HttpPostReqHeader('website/updateMobileNo', formValue2, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        let counter = 120;
        const interval = setInterval(() => {
          console.log(counter);
          counter--;
          this.timeleft2 = counter + ' Seconds';
          if (counter == 0) {
            clearInterval(interval);
            console.log('Ding!');
            this.timeleft2 = "";
          }
        }, 1000);
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
          this.mobileSendButton = true;
          this.mobileReSendButton = false;
        }, 120000);
        this.mobileUpdateForm.controls['mobile_otp'].enable();
        this.mobileUpdateForm.controls['mobile_no'].disable();
      } else {
        this.spinnerService.hide();
        event.target.disabled = false;
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  verifyMobileOTP() {
    this.infoMessage = '';
    this.infoMessageRed = '';

    this.spinnerService.show();
    const formValue5 = {
      mobile_otp: this.mobileUpdateForm.value.mobile_otp
    }

    this.api_service.HttpPostReqHeader('website/verifyChangeMobileOTP', formValue5, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        ($('#mobileEdit') as any).modal('hide');
        this.mobileUpdateForm.reset();
        this.timeleft = "";
        this.getUserProfile();
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }
//sp notification
  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         // console.log('get new notification response => ', response);
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

  //sr notification
  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         // console.log('SR get new notification response => ', response);
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
