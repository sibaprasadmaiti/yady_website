import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sp-earning-list',
  templateUrl: './sp-earning-list.component.html',
  styleUrls: ['./sp-earning-list.component.css']
})
export class SpEarningListComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = localStorage.getItem('user_type');
  myTransactionData: any[] = [];
  page = 1;
  perPage: any = 10;
  totalRecords: any = 0;
  from_date: any = "";
  to_date: any = "";
  newNotification = false;

  constructor(
    public formbuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    if ((this.logtoken == '' || this.logtoken == null) && this.userType != '2') {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getNewNotification();
  }

  seachTransaction() {
    if(!this.from_date || this.from_date == ""){
      alert("Please choose from date.");
      return false;
    }
    if(!this.to_date || this.to_date == ""){
      alert("Please choose to date.");
      return false;
    }
    this.getSpTransactionDetails();
  }

  getSpTransactionDetails() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSpTransactionList?token=${this.logtoken}&from_date=${this.from_date}&to_date=${this.to_date}`, true)
      .then(
        (response: any) => {
          //console.log('SP Transaction response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.myTransactionData = response.data;
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);
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
}
