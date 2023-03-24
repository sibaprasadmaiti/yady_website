import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  notificationList: any[] = [];
  message: any;
  newNotification = false;
  page = 1;
  perPage = 10;
  totalRecords: any = 0;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private translateService: TranslateService) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.getNotificationList(this.page);

    }
  }

  getNotificationList(page: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNotificationList?token=${this.logtoken}&page=${page}&perPage=${this.perPage}`, true)
      .then(
        (response: any) => {
          //console.log('get all notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.notificationList = response.data;
            this.totalRecords = response.totalData;
            this.getNewNotification();
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
    this.getNotificationList(page);
  }

  deleteNotification(id: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/deleteNotification?token=${this.logtoken}&notification_id=${id}`, true)
      .then(
        (response: any) => {
          //console.log('Delete notification response => ', response);
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

  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('get new notification response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.newNotification = response.data;
            this.readNotification();
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
