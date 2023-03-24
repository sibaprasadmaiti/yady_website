import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sp-booking-list',
  templateUrl: './sp-booking-list.component.html',
  styleUrls: ['./sp-booking-list.component.css']
})
export class SpBookingListComponent implements OnInit {
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
    if (this.logtoken == '' || this.logtoken == null ||this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }

    this.getMyBookingList(0);
    this.getNewNotification();
  }

  getMyBookingList(booking_status: any) {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/bookingList/?token=${token}&booking_status=${booking_status}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          //console.log('sp booking list', response.data);
          this.booking_data = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  rejectConfirmation(booking_id: any){
    this.message = "Are you sure want to reject the booking?";
    ($('#warningModal') as any).modal('show');
    this.rejectBookingId = booking_id;
  }

  rejectRequest(){
    this.spinnerService.show();
    var body_obj = { booking_id: this.rejectBookingId };
    this.api_service.HttpPostReqHeader('website/rejectBooking', body_obj, true, this.logtoken).then((response: any) => {
      //console.log("Request Reject Responce ====> ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = "Booking rejected successfully";
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else if (response.success == false) {
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  acceptRequest(booking_id: any){
    this.spinnerService.show();
    var body_obj = { booking_id: booking_id };
    this.api_service.HttpPostReqHeader('website/acceptBooking', body_obj, true, this.logtoken).then((response: any) => {
      //console.log("Request Accept Responce ====> ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = "Booking accepted successfully";
          ($('#successModal') as any).modal('show');
          setTimeout(() => {
            window.location.reload();
          }, 5000);

      } else if (response.success == false) {
        this.spinnerService.hide();
        this.message = response.message;
        ($('#warning_modal') as any).modal('show');
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  viewDetails(booking_id: string) {
    console.log(booking_id);
    this.router.navigateByUrl(`/sp-booking-details/${booking_id}`);
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
