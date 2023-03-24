import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
//import { ServiceChargeComponent } from '../../pages/service-charge/service-charge.component';
//import * as bootstrap from 'bootstrap';
//import * as $ from 'jquery';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  loginForm: FormGroup;
  reg1Form: FormGroup;
  reg2Form: FormGroup;
  reg3Form: FormGroup;
  paymentForm: FormGroup;
  forgetPassForm: FormGroup;
  loginFormSP: FormGroup;
  emailVerifyForm: FormGroup;
  mobileVerifyForm: FormGroup;
  spSaveForm: FormGroup;
  spforgetPassForm: FormGroup;
  infoMessage = "";
  infoMessageRed = "";
  //country_code_val = 1;
  logtoken = localStorage.getItem('LoginToken');
  timeleft: any;
  timeleft2: any;
  isShowDiv = false;
  isShowDiv2 = true;
  isShowDiv3 = false;
  isShowDiv4 = true;
  addressData;
  sendButtonShow = false;
  reSendButtonShow = true;
  sendMobileButton = false;
  resendMobileButton = true;
  currentYear = new Date().getFullYear();
  fbLoginUserType = 1;

  auth2: any;

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;

  @ViewChild('spLoginRef', { static: true }) spLoginElement: ElementRef;

  //@ViewChild(ServiceChargeComponent, {static: false}) scc: ServiceChargeComponent;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.loginForm = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });
    this.reg1Form = formbuilder.group({
      mobile_no: ['', Validators.compose([Validators.required])],
      mobile_otp: ['', Validators.compose([Validators.required])],
      country_code: ['', Validators.compose([Validators.required])]
    });
    this.reg2Form = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])],
      email_otp: ['', Validators.compose([Validators.required])]
    });
    this.reg3Form = formbuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });
    this.paymentForm = formbuilder.group({
      card_number: ['', Validators.compose([Validators.required, Validators.maxLength(19), Validators.pattern("[0-9 ]+")])],
      month: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      year: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      cvv: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    });
    this.forgetPassForm = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])]
    });

    this.loginFormSP = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });
    this.emailVerifyForm = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])],
      email_otp: ['', Validators.compose([Validators.required])]
    });
    this.mobileVerifyForm = formbuilder.group({
      mobile_no: ['', Validators.compose([Validators.required])],
      mobile_otp: ['', Validators.compose([Validators.required])],
      country_code: ['', Validators.compose([Validators.required])]
    });
    this.spSaveForm = formbuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)])]
    });
    this.spforgetPassForm = formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)])]
    });
  }

  ngOnInit() {
    console.log(this.logtoken);
    if (this.logtoken != '' && this.logtoken != undefined) {
      console.log('we are here');
    }
    this.googleSDK();
    this.fbLibrary();
  }

  prepareLoginButton() {

    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        console.log('profile : ' + profile);
        //YOUR CODE HERE
        const userData = {
          token: googleUser.getAuthResponse().id_token,
          id: profile.getId(),
          first_name: profile.getName().split(' ')[0],
          last_name: profile.getName().split(' ')[1],
          image: profile.getImageUrl(),
          email: profile.getEmail(),
          registered_from: 2,
          user_type: 1,
        }
        // console.log("Object data => ", profile);

       this.socialLogin(userData);

      }, (error) => {
        console.log("error => ", error);

        alert(JSON.stringify(error, undefined, 2));
      });

  }

  spPrepareLoginButton() {
    this.auth2.attachClickHandler(this.spLoginElement.nativeElement, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        console.log('profile : ' + profile);
        //YOUR CODE HERE
        const userData = {
          token: googleUser.getAuthResponse().id_token,
          id: profile.getId(),
          first_name: profile.getName().split(' ')[0],
          last_name: profile.getName().split(' ')[1],
          image: profile.getImageUrl(),
          email: profile.getEmail(),
          registered_from: 2,
          user_type: 2,
        }
        console.log("get sp google login data => ", profile);

        this.socialLogin(userData);

      }, (error) => {
        console.log("error => ", error);

        alert(JSON.stringify(error, undefined, 2));
      });

  }

  googleSDK() {

    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '112614002267-urbq0ao3jt62ntmc3mlnjf86lvhk8qkr.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
       // this.spPrepareLoginButton();
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }

  socialLogin(userData: any) {
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    this.api_service.HttpPostReq('website/socialLogin', userData, true).then((response: any) => {
      console.log("Social login response => ", response);

      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        localStorage.setItem('LoginToken', response.token);
        localStorage.setItem('userID', response.userData._id);
        localStorage.setItem('first_name', response.userData.first_name);
        localStorage.setItem('last_name', response.userData.last_name);
        localStorage.setItem('email', response.userData.email);
        localStorage.setItem('user_type', response.userData.user_type);
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });

      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }


  fbLibrary() {

    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: '671955857929733',
        cookie: true,
        xfbml: true,
        version: 'v15.0'
      });
      window['FB'].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  facebookLogin(userType: any) {
    console.log("user type ", userType);

    window['FB'].login((response) => {
     // console.log('login response', response);
      if (response.authResponse) {

        window['FB'].api('/me', {
          fields: 'last_name, first_name, email, picture'
        }, (userInfo) => {

          if(userType == 2){
            this.fbLoginUserType = 2;
          }
          const userData = {
            id: userInfo.id,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            image: userInfo.picture.data.url,
            registered_from: 3,
            user_type: this.fbLoginUserType,
          }

          this.socialLogin(userData);
        });

      } else {
        alert('User login failed');
        console.log('User login failed');
      }
    }, { scope: 'email' });
  }

  loginData() {
    this.infoMessage = '';
    this.infoMessageRed = '';
    console.log(this.loginForm.value);
    this.spinnerService.show();
    let formValue = this.loginForm.value;
    this.api_service.HttpPostReq('website/customerLogin', formValue, true).then((response: any) => {
      if (response.success == true) {
        //console.log('zzzzzz',response); return false;
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        //this.toastr.success(response.message);
        localStorage.setItem('LoginToken', response.token);
        localStorage.setItem('userID', response.userData._id);
        localStorage.setItem('first_name', response.userData.first_name);
        localStorage.setItem('last_name', response.userData.last_name);
        localStorage.setItem('email', response.userData.email);
        localStorage.setItem('user_type', response.userData.user_type);
        /*this.snackBar.open(response.message, 'End now', {
          duration: 5000,
        });*/
        // this.getUserAddresses(response.token);
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });

      }
      else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  logOut() {
    localStorage.clear();
    //this.router.navigateByUrl('/');
  }

  // getUserAddresses(token: any) {
  //   this.spinnerService.show();
  //   this.api_service.HttpGetReq(`website/addressList?token=${token}`, true).then((response: any) => {
  //     this.spinnerService.hide();
  //     console.log('Address responce ====> ', response.data);
  //     if (response.type == 'tokenexpire') {
  //       this.router.navigateByUrl('/')
  //         .then(() => {
  //           localStorage.clear();
  //           window.location.reload();
  //         });
  //     }
  //     this.addressData = response.data;
  //     if(response.data.length > 0){
  //       this.router.navigate(['/profile']).then(() => {
  //         window.location.reload();
  //       });
  //     }else{
  //       this.router.navigateByUrl('/my-address-add').then(() =>{
  //         window.location.reload();
  //       })
  //     }

  //   },
  //     (error) => {
  //       this.spinnerService.hide();
  //     }
  //   );
  // }

  getMobileOTP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    //console.log(this.reg1Form.value); return false;
    this.spinnerService.show();
    const formValue2 = {
      only_mobile_no: this.reg1Form.value.mobile_no,
      country_code: this.reg1Form.value.country_code,
      user_id: localStorage.getItem('user_id')
    }
    //console.log(formValue2); return false;
    this.api_service.HttpPostReq('website/sendMobileOTP', formValue2, true).then((response: any) => {
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
          this.isShowDiv3 = true;
          this.isShowDiv4 = false;
        }, 120000);
        this.reg1Form.controls['mobile_otp'].enable();
        this.reg1Form.controls['mobile_no'].disable();
      } else {
        this.spinnerService.hide();
        event.target.disabled = false;
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })

    //console.log(this.reg1Form.value.mobile_no);
    //var number = mobile_no.getNumber();
    //console.log(number);
    //var extension = iti.getSelectedCountryData();
    //console.log(extension);
    //console.log(this.reg1Form.value.mobile_no.getNumber(intlTelInputUtils));
    //console.log(this.reg1Form.value.mobile_no.iti.getSelectedCountryData().iso2);
    //this.reg1Form.controls['mobile_otp'].enable();

    //const addcontent = this.reg1Form.value;
    //const formValue2 = {
    //x1 : this.reg1Form.value.mobile_no.getNumber(intlTelInputUtils.numberFormat.E164),
    //x2 : addcontent.mobile_no.getNumber(intlTelInput("getSelectedCountryData").dialCode)
    //}
    //console.log(formValue2);

  }
  onCountryChange(ev) {
    console.log(ev.dialCode);
    //this.country_code_val = ev.dialCode;
    this.reg1Form.patchValue({
      country_code: ev.dialCode
    });
    this.mobileVerifyForm.patchValue({
      country_code: ev.dialCode
    });
  }
  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }
  /*getNumber(x) {
    console.log('xxxxxxxx',x);
  }*/
  verifyMobileOTP() {
    this.infoMessage = '';
    this.infoMessageRed = '';

    this.spinnerService.show();
    const formValue5 = {
      otp: this.reg1Form.value.mobile_otp,
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/verifyMobileOtp', formValue5, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        //$('#demo-3').modal('hide');
        //$('#demo-2').modal('show');
        ($('#demo-2') as any).modal('hide');
        ($('#demo-4') as any).modal('show');
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  getEmailOTP(event: any) {
    event.target.disabled = true;

    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const formValue3 = {
      email: this.reg2Form.value.email
    }
    this.api_service.HttpPostReq('website/sendEmailOTP', formValue3, true).then((response: any) => {
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
        this.reg2Form.controls['email_otp'].enable();
        //console.log(response.Data._id);
        localStorage.setItem('user_id', response.Data._id);
        this.reg2Form.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.isShowDiv = true;
          this.isShowDiv2 = false;
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
      email_otp: this.reg2Form.value.email_otp,
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/verifyEmailOtp', formValue4, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        //$('#demo-3').modal('hide');
        //$('#demo-2').modal('show');
        ($('#demo-3') as any).modal('hide');
        ($('#demo-2') as any).modal('show');
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

  saveUser() {
    this.infoMessage = '';
    this.infoMessageRed = '';

    this.spinnerService.show();

    if (this.reg3Form.value.password != this.reg3Form.value.confirm_password) {
      this.infoMessageRed = 'New Password and Confirm Password does not match';
      setTimeout(() => {
        this.infoMessageRed = "";
      }, 5000);
      this.infoMessage = '';
      return false;
    }

    const formValue6 = {
      first_name: this.reg3Form.value.first_name,
      last_name: this.reg3Form.value.last_name,
      password: this.reg3Form.value.password,
      user_id: localStorage.getItem('user_id')
    }

    this.api_service.HttpPostReq('website/saveUser', formValue6, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        ($('#demo-4') as any).modal('hide');
        ($('#demo-1') as any).modal('show');
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  resendEmailOTP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const formValue7 = {
      user_id: localStorage.getItem('user_id')
    }

    this.api_service.HttpPostReq('website/resendEmailOTP', formValue7, true).then((response: any) => {
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
        this.reg2Form.controls['email_otp'].enable();
        //localStorage.setItem('user_id', response.Data._id);
        this.reg2Form.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.isShowDiv = true;
          this.isShowDiv2 = false;
          event.target.disabled = false;
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

  resendMobileOTP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const formValue8 = {
      user_id: localStorage.getItem('user_id')
    }

    this.api_service.HttpPostReq('website/resendMobileOTP', formValue8, true).then((response: any) => {
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
        this.reg1Form.controls['mobile_otp'].enable();
        this.reg1Form.controls['mobile_no'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.isShowDiv3 = true;
          this.isShowDiv4 = false;
          event.target.disabled = false;
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

  async payment() {

    await (<any>window).Stripe.card.createToken({
      number: this.paymentForm.value.card_number.replace(/\s/g, ''),
      exp_month: this.paymentForm.value.month,
      exp_year: this.paymentForm.value.year,
      cvc: this.paymentForm.value.cvc
    }, (status: number, response: any) => {
      console.log(status);
      console.log(response);
      if (status == 402) {
        alert('Invalid Card Details');
        return false;
      } else if (status == 200) {
        console.log('xvx', response.id);
        this.saveCreditCard(response.id);
      }
    })
  }

  saveCreditCard(stripe_token) {
    this.spinnerService.show();
    var first_name = localStorage.getItem('first_name');
    var last_name = localStorage.getItem('last_name');
    var full_name = first_name + last_name;
    var email = localStorage.getItem('email');

    const formCard = {
      name: full_name,
      email: email,
      stripe_token: stripe_token
    }

    this.api_service.HttpPostReqHeader('website/saveCardDetails', formCard, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        ($('#paymentcard') as any).modal('hide');
        window.location.reload();
      } else {
        this.spinnerService.hide();
        alert(response.message);
        ($('#paymentcard') as any).modal('hide');
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  forgetPassword() {
    //console.log(this.forgetPassForm.value);
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const forgetPassVal = this.forgetPassForm.value;
    this.api_service.HttpPostReq('website/serviceRequesterForgetPassword', forgetPassVal, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
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

  spLogin() {
    this.infoMessage = '';
    this.infoMessageRed = '';
    console.log(this.loginFormSP.value);
    this.spinnerService.show();
    let formValueSP = this.loginFormSP.value;
    this.api_service.HttpPostReq('website/serviceProviderLogin', formValueSP, true).then((response: any) => {
      if (response.success == true) {
        //console.log('zzzzzz',response); return false;
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        localStorage.setItem('LoginToken', response.token);
        localStorage.setItem('userID', response.userData._id);
        localStorage.setItem('first_name', response.userData.first_name);
        localStorage.setItem('last_name', response.userData.last_name);
        localStorage.setItem('email', response.userData.email);
        localStorage.setItem('user_type', response.userData.user_type);
        this.router.navigate(['/profile'])
          .then(() => {
            window.location.reload();
          });
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  getEmailOTPSP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const emailVerifyValue3 = {
      email: this.emailVerifyForm.value.email
    }
    this.api_service.HttpPostReq('website/serviceProviderSendEmailOTP', emailVerifyValue3, true).then((response: any) => {
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
        this.emailVerifyForm.controls['email_otp'].enable();
        localStorage.setItem('user_id', response.Data._id);
        this.emailVerifyForm.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.sendButtonShow = true;
          this.reSendButtonShow = false;
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
  resendEmailOTPSP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const resendEmailOTPVal = {
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/resendServiceProviderEmailOTP', resendEmailOTPVal, true).then((response: any) => {
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
        this.emailVerifyForm.controls['email_otp'].enable();
        this.emailVerifyForm.controls['email'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.sendButtonShow = true;
          this.reSendButtonShow = false;
          event.target.disabled = false;
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
  verifySPEmailOTP() {
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const verifySPEmailVal = {
      email_otp: this.emailVerifyForm.value.email_otp,
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/verifySPEmailOtp', verifySPEmailVal, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        ($('#sp_email_verify') as any).modal('hide');
        ($('#sp_mobile_verify') as any).modal('show');
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
  getMobileOTPSP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const mobileVerifyFormVal = {
      only_mobile_no: this.mobileVerifyForm.value.mobile_no,
      country_code: this.mobileVerifyForm.value.country_code,
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/sendMobileOTPSP', mobileVerifyFormVal, true).then((response: any) => {
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
          this.sendMobileButton = true;
          this.resendMobileButton = false;
        }, 120000);
        this.mobileVerifyForm.controls['mobile_otp'].enable();
        this.mobileVerifyForm.controls['mobile_no'].disable();
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

  resendMobileOTPSP(event: any) {
    event.target.disabled = true;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const resendMobileVerifyFormval = {
      user_id: localStorage.getItem('user_id')
    }

    this.api_service.HttpPostReq('website/resendMobileOTPSP', resendMobileVerifyFormval, true).then((response: any) => {
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
        this.mobileVerifyForm.controls['mobile_otp'].enable();
        this.mobileVerifyForm.controls['mobile_no'].disable();
        setTimeout(() => {
          this.infoMessage = "";
          this.sendMobileButton = true;
          this.resendMobileButton = false;
          event.target.disabled = false;
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
  verifyMobileOTPSP() {
    this.infoMessage = '';
    this.infoMessageRed = '';

    this.spinnerService.show();
    const verifyMobileVal = {
      otp: this.mobileVerifyForm.value.mobile_otp,
      user_id: localStorage.getItem('user_id')
    }
    this.api_service.HttpPostReq('website/verifyMobileOtpSP', verifyMobileVal, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        ($('#sp_mobile_verify') as any).modal('hide');
        ($('#sp_register') as any).modal('show');
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }
  saveSP() {
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();

    if (this.spSaveForm.value.password != this.spSaveForm.value.confirm_password) {
      this.infoMessageRed = 'New Password and Confirm Password does not match';
      setTimeout(() => {
        this.infoMessageRed = "";
      }, 5000);
      this.infoMessage = '';
      return false;
    }

    const spSaveFormVal = {
      first_name: this.spSaveForm.value.first_name,
      last_name: this.spSaveForm.value.last_name,
      password: this.spSaveForm.value.password,
      user_id: localStorage.getItem('user_id')
    }

    this.api_service.HttpPostReq('website/saveSP', spSaveFormVal, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 5000);
        ($('#sp_register') as any).modal('hide');
        ($('#sp_login_modal') as any).modal('show');
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }

  spforgetPassword() {
    //console.log('123'); return false;
    this.infoMessage = '';
    this.infoMessageRed = '';
    this.spinnerService.show();
    const forgetPassVal = this.spforgetPassForm.value;
    this.api_service.HttpPostReq('website/serviceProviderForgetPassword', forgetPassVal, true).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.infoMessage = response.message;
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

  cardNumberFormat(e: any) {
    e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
  }
}
