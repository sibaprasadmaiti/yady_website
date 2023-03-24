import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-query-bookings',
  templateUrl: './query-bookings.component.html',
  styleUrls: ['./query-bookings.component.css']
})
export class QueryBookingsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  booking_data: any = [];
  page = 1;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService,
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
    this.getdefaultaddress(this.logtoken);
  }

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.queryBookingList(1);
        this.srGetNewNotification();
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

  queryBookingList(booking_status: any) {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/queryBookingList/?token=${token}&booking_status=${booking_status}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          console.log('ccccccccc', response.data);
          this.booking_data = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  viewDetails(query_booking_id: string) {
    this.router.navigateByUrl(`/query-booking-details/${query_booking_id}`);
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

}
