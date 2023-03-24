import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sr-notification',
  templateUrl: './sr-notification.component.html',
  styleUrls: ['./sr-notification.component.css']
})
export class SrNotificationComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  notificationList: any;
  message: any;
  srNewNotification = false;
  page = 1;
  perPage = 10;
  totalRecords: any = 0;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.srGetNotificationList(this.page);
      // this.srGetNewNotification();
      this.srReadNotification();
    }
  }

  srGetNotificationList(page: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNotificationList?token=${this.logtoken}&page=${page}&perPage=${this.perPage}`, true)
      .then(
        (response: any) => {
          //console.log('sr get all notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.notificationList = response.data;
            this.totalRecords = response.totalData;
          } else {
            this.spinnerService.hide();
            this.notificationList = [];
          }
        },
        (error) => {
          this.spinnerService.hide();
        });
  }

  nextPage(page: any) {
    this.srGetNotificationList(page);
  }

  srDeleteNotification(id: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srDeleteNotification?token=${this.logtoken}&notification_id=${id}`, true)
      .then(
        (response: any) => {
          //console.log('SR Delete notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            ($('#warningModal') as any).modal('hide');
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          } else {
            this.spinnerService.hide();
            ($('#successModal') as any).modal('hide');
            this.message = response.message;
            ($('#warningModal') as any).modal('show');
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }
        },
        (error) => {
          this.spinnerService.hide();
        });
  }

  // srGetNewNotification() {
  //   this.spinnerService.show();
  //   this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
  //     .then(
  //       (response: any) => {
  //         console.log('sr get new notification response => ', response);
  //         if (response.success) {
  //           this.spinnerService.hide();
  //           this.srNewNotification = response.data;
  //         } else {
  //           this.spinnerService.hide();
  //           this.srNewNotification = response.data;
  //         }
  //       },
  //       (error) => {
  //         this.spinnerService.hide();
  //         this.srNewNotification = false;
  //       });
  // }

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


