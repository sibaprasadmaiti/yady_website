import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sp-query-booking-list',
  templateUrl: './sp-query-booking-list.component.html',
  styleUrls: ['./sp-query-booking-list.component.css']
})
export class SpQueryBookingListComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
	booking_data:any = [];
  message: any;
  rejectBookingId: any;
  page = 1;
  newNotification = false;

  constructor(public formbuilder: FormBuilder,private route: ActivatedRoute, private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService, public toastr: ToastrService) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getMyBookingList(1);
    this.getNewNotification();
  }

  getMyBookingList(booking_status: any) {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/spQueryBookingList/?token=${token}&booking_status=${booking_status}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          //console.log('sp query booking list', response.data);
          this.booking_data = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  viewDetails(query_booking_id: string) {
    this.router.navigateByUrl(`/sp-query-booking-details/${query_booking_id}`);
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
