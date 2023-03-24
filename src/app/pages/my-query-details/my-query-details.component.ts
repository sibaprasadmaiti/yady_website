import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-query-details',
  templateUrl: './my-query-details.component.html',
  styleUrls: ['./my-query-details.component.css']
})
export class MyQueryDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  queryServiceId: any;
  myQueryDetails: any;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private translateService: TranslateService) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.route.params.subscribe(params => {
      this.queryServiceId = params.query_service_id;
      this.queryServiceDetails();
    });

  }

  queryServiceDetails(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srQueryServiceDetails?token=${this.logtoken}&query_service_id=${this.queryServiceId}`, true)
      .then(
        (response: any) => {
          console.log('My query details response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.myQueryDetails = response.data;
          } else {
            this.spinnerService.hide();
            this.myQueryDetails = [];
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);

        });
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
