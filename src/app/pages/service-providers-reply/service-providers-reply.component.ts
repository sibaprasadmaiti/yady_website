import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-service-providers-reply',
  templateUrl: './service-providers-reply.component.html',
  styleUrls: ['./service-providers-reply.component.css']
})
export class ServiceProvidersReplyComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  queryServiceId: any;
  queryReplyData: any[] = [];
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) { }

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
      this.queryReplyList();
    });
  }

  queryReplyList(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/queryReplyList?token=${this.logtoken}&query_service_id=${this.queryServiceId}`, true)
      .then(
        (response: any) => {
         // console.log('query reply response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.queryReplyData = response.data;
          } else {
            this.spinnerService.hide();
            this.queryReplyData = [];
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);

        });
  }

  bookService(query_service_assign_id: any){
    this.router.navigateByUrl(`/query-reply-details/${query_service_assign_id}`);
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
