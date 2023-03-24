import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-query-service-details',
  templateUrl: './query-service-details.component.html',
  styleUrls: ['./query-service-details.component.css']
})
export class QueryServiceDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  message: any;
  newNotification = false;
  queryServiceDetails: any;
  queryServiceId: any;
  writeAnswerBtnShow = true;
  queryAnswerForm: FormGroup;
  attachDocs: any[] = [];

  constructor(public formbuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.queryAnswerForm = formbuilder.group({
      service_time: ['', Validators.compose([Validators.required])],
      service_cost: ['', Validators.compose([Validators.required])],
      service_details: ['', Validators.compose([Validators.required])],
      query_doc: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    } else {
      this.route.params.subscribe(params => {
        this.queryServiceId = params.query_service_id;
      });
      this.getNewNotification();
      this.getQueryServiceDetails();
    }
  }
  getQueryServiceDetails() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/queryServiceDetails?token=${this.logtoken}&query_service_id=${this.queryServiceId}`, true)
      .then(
        (response: any) => {
         // console.log('get service details response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.queryServiceDetails = response.data;
          } else {
            this.spinnerService.hide();
            this.queryServiceDetails = {};
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);

        });
  }

  writeAnswer() {
    this.writeAnswerBtnShow = false;
  }

  cancel() {
    this.writeAnswerBtnShow = true;
  }

  readURL(event: any) {
    this.attachDocs = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        this.attachDocs.push(file);
       // let reader = new FileReader();
        // reader.onload = (e: any) => {
        //   this.imageSrc.push(e.target.result);
        // }
        // reader.readAsDataURL(file);
      }
    }
  }

  answerQueryService() {
    let formValue = this.queryAnswerForm.value;
    formValue.query_service_assign_id = this.queryServiceDetails.query_service_assign_id;
    let form_data = new FormData();
    form_data.append('query_data', JSON.stringify(formValue));
   // console.log(this.attachDocs.length);

    if (this.attachDocs.length > 0 && this.attachDocs.length <= 2){
      for (let file of this.attachDocs) {
        { form_data.append('query_doc', file); }
      }
    }else{
      alert("Maximum two document supported.");
    }

    this.spinnerService.show();

    this.api_service.HttpPostReqHeader('website/replayQueryService', form_data, true, this.logtoken).then((response: any) => {
      //console.log("Query replay responce ==>  ", response);
      this.message = response.message;
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          this.message = "";
          window.location.reload();
        }, 5000);
      }
      else {
        this.spinnerService.hide();
        ($('#warningModal') as any).modal('show');
        setTimeout(() => {
          this.message = "";
          window.location.reload();
        }, 5000);
      }
    })

  }

  requestVisitToSrHome() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/requestHomeVisit?token=${this.logtoken}&query_service_id=${this.queryServiceId}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          if (response.success) {
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            this. getQueryServiceDetails();
            setTimeout(() => {
              this.message = "";
              ($('#successModal') as any).modal('hide');
            }, 4000);
          }
        },
        (error) => {
          this.spinnerService.hide();
        });
  }

  homeVisitComplete() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/homeVisitComplete?token=${this.logtoken}&query_service_id=${this.queryServiceId}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          if (response.success) {
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            this. getQueryServiceDetails();
            setTimeout(() => {
              this.message = "";
              ($('#successModal') as any).modal('hide');
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

  readNotification() {
    this.api_service.HttpPostReqHeader('website/readNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.newNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
