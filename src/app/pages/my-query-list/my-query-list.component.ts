import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-query-list',
  templateUrl: './my-query-list.component.html',
  styleUrls: ['./my-query-list.component.css']
})
export class MyQueryListComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  srNewNotification = false;
  queryServiceList: any;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService, private translateService: TranslateService) { }

  ngOnInit() {
    if(this.logtoken == '' || this.logtoken == null) {
			this.router.navigateByUrl('/')
				.then(() => {
				localStorage.clear();
				window.location.reload();
			});
		}
    this.srGetNewNotification();
    this.getQueryServiceList();
  }

  getQueryServiceList(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/queryServiceList?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         //console.log('query service list response => ', response);
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
        });
  }

  viewDetails(query_service_id: any){
    this.router.navigateByUrl(`/my-query-details/${query_service_id}`);
  }

  providerReply(query_service_id: any){
    this.router.navigateByUrl(`/query-reply-list/${query_service_id}`);
  }

  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         // console.log('sr get new notification response => ', response);
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
