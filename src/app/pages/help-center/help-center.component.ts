import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent implements OnInit {
  helpForm: FormGroup;
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  infoMessage = "";
  infoMessageRed = "";
  addressData: any;
  helpData: any;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService,
    private translateService: TranslateService) {
      this.helpForm = formbuilder.group({
        full_name: ['', Validators.compose([Validators.required])],
        email_address: ['', Validators.compose([Validators.required])],
        subject: ['', Validators.compose([Validators.required])],
        message: ['', Validators.compose([Validators.required])]
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
      this.getdefaultaddress(this.logtoken);
      this.srReadNotification();
    }
  }

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.addressData = response.data;
        this.getHelpCenterNumber();
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

  getHelpCenterNumber() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getHelpCenterNumber?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
      if (response.success) {
        this.helpData = response.data;
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  submitHelpForm() {
    let formValue = this.helpForm.value;
    let objdata = {
      name: formValue.full_name,
      email: formValue.email_address,
      subject: formValue.subject,
      message: formValue.message,
    }
    //console.log("form data => ", formValue);
    this.spinnerService.show();
    this.api_service.HttpPostReqHeader('website/srHelpPost', objdata, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.helpForm.reset();
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(function(){
          this.infoMessage ="";
        }, 4000);
      }else {
        this.spinnerService.hide();
        this.infoMessage = response.message;
        setTimeout(function(){
          this.infoMessage ="";
        }, 4000);
      }
    })
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
