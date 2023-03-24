import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-query-service-list',
  templateUrl: './query-service-list.component.html',
  styleUrls: ['./query-service-list.component.css']
})
export class QueryServiceListComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  message: any;
  newNotification = false;
  queryServiceList: any;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) { }

  ngOnInit() {
    if ((this.logtoken == '' || this.logtoken == null) && this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.getNewNotification();
      this.getQueryService();
    }
  }

  getQueryService(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getQueryService?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('get query service response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.queryServiceList = response.data;
          } else {
            this.spinnerService.hide();
            this.queryServiceList = response.data;
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);

        });
  }

  viewDetails(query_service_id: any){
    this.router.navigateByUrl(`/query-request-details/${query_service_id}`);
  }

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

  readNotification(){
    this.api_service.HttpPostReqHeader('website/readNotification', {}, true, this.logtoken).then((response: any) => {
     // console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.newNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
