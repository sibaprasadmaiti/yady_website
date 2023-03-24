import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { SocketService } from '../../services/socket.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
// import * as $ from "jquery";
import * as moment from 'moment';

@Component({
  selector: 'app-query-booking-details',
  templateUrl: './query-booking-details.component.html',
  styleUrls: ['./query-booking-details.component.css']
})
export class QueryBookingDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  message: any;
  queryBookingId: any;
  bookingData: any;
  confirmStatus: any;
  adminApproval: any;
  pauseType: any;
  extraPartsData: any;
  cardData: any;
  extraDayConfirmStatus: any;
  extraTimeStatus: any;
  queryExtraTimeId: any;
  ratingCount = 0;
  reviewText = "";

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private elementRef: ElementRef, private socketService: SocketService, private socket: Socket) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.route.params.subscribe(params => {
      this.queryBookingId = params.query_booking_id;
      this.getQueryBookingDetails(params.query_booking_id);
    });

     //Socket Connection
     this.socket.on('connected', message => {
      if (message == 'Welcome') {
        console.log("socket is connected for SR query service details.....");
        this.socket.on('pause_reason', pauseReson => {
          console.log("Pause reson => ", pauseReson);
          this.confirmStatus = pauseReson.confirm_status;
          this.adminApproval = pauseReson.admin_approval_status;
          this.pauseType = pauseReson.pause_type;
          if (pauseReson.admin_approval_status == 1) {
            this.getExtraPartData(this.queryBookingId);
          }
        });
        this.socket.on('query_extra_time', data => {
          console.log("Query extra time socket responce => ", data);
          this.extraDayConfirmStatus = data.extra_day_confirm_status;
        });

        // this.socket.on('complete_service', completeService => {
        //   if (completeService.start_status == 2) {
        //     clearInterval(this.myTimer);
        //     delete this.myTimer;
        //     this.isVisible = false;
        //     this.serviceCompleteMsg = "Your Service has been completed by the Service Provider";
        //     setTimeout(() => {
        //       ($('#ratingReviewModal') as any).modal('show');
        //     }, 1000);
        //     //Modal close with out rating & review submission
        //     ($('body') as any).click(function (event){
        //       if(event.target.id == "ratingReviewModal"){
        //           window.location.reload();
        //       }
        //     });
        //   }
        // });
        this.socket.on('disconnect', disconnectData => {
          console.log("Socket is disconnect");
        });
      }
    });
  }

  getQueryBookingDetails(query_booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/QueryBookingDetails/?token=${token}&query_booking_id=${query_booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            console.log('Qury booking details responce =>', response.data);
            this.bookingData = response.data;
            this.confirmStatus = response.data.extra_part_confirm_status;
            this.adminApproval = response.data.admin_approval_status;
            this.pauseType = response.data.pause_type;
            if ((response.data.admin_approval_status == 1 && response.data.pause_type == 2)) {
              this.getExtraPartData(query_booking_id);
            }
            this.extraDayConfirmStatus = response.data.extra_day_confirm_status;
            this.extraTimeStatus = response.data.extra_time_status;
            this.queryExtraTimeId = response.data.query_extra_time_id;
            this.spinnerService.hide();
          } else {
            this.bookingData = [];
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  getSavedCards() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSavedCards?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          if (response.type == 'tokenexpire') {
            this.router.navigateByUrl('/')
              .then(() => {
                localStorage.clear();
                window.location.reload();
              });
          }
          this.cardData = response.data;
         // console.log('cardData => ', this.cardData);
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  makeDefault(card_id) {
    //console.log(card_id);
    this.spinnerService.show();
    const card_val = {
      stripe_card_id: card_id,
    }
    this.api_service.HttpPostReqHeader('website/setDefaultCard', card_val, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.getSavedCards();
      } else {
        this.spinnerService.hide();
      }
    })
  }

  startTracking() {
    this.router.navigateByUrl(`/tracking/${this.bookingData._id}`);
  }

  getExtraPartData(query_booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getExtraPartData/?token=${token}&query_booking_id=${query_booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
           // console.log('Extra parts Data Responce =>', response.data);
            this.extraPartsData = response.data;
            // this.pauseType = response.data.pause_type;
            // this.adminApprovalStatus = response.data.admin_approval_status;
            this.spinnerService.hide();
          } else {
            this.extraPartsData = [];
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  rejectAditionalParts(query_booking_id: any, booking_pause_id: any) {
    this.spinnerService.show();
    ($('#additonalPartsReject') as any).modal('hide');
    this.api_service.HttpGetReq(`website/rejectExtraPart?token=${this.logtoken}&query_booking_id=${query_booking_id}&booking_pause_id=${booking_pause_id}`, true)
    .then((response: any) => {
     // console.log("Reject responce => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.confirmStatus = 2;
        this.message = response.message;
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else if (response.success == false) {
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  payment() {
    ($('#additonalPartsAccept') as any).modal('hide');
    if (this.bookingData.paid_medium == 1) {
      ($('#onlinePayment') as any).modal('show');
      this.getSavedCards();
    }
    if (this.bookingData.paid_medium == 2) {
      this.spinnerService.show();
      var body_obj = {
        query_booking_id: this.bookingData._id,
        booking_pause_id: this.extraPartsData.booking_pause_id,
        cost: this.extraPartsData.cost,
        currency: this.extraPartsData.currency,
        paid_medium: this.bookingData.paid_medium
      };
      this.api_service.HttpPostReqHeader('website/extraPartPayment', body_obj, true, this.logtoken).then((response: any) => {
       // console.log("Additional parts cash payment responce => ", response);

        if (response.success == true) {
          this.spinnerService.hide();
          this.confirmStatus = 1;
          this.message = response.message;
          ($('#successModal') as any).modal('show');
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          this.spinnerService.hide();
          ($('#warningModal') as any).modal('show');
        }
      })
    }
  }

  onlinePayment() {

    this.spinnerService.show();
    var body_obj = {
      query_booking_id: this.bookingData._id,
      booking_pause_id: this.extraPartsData.booking_pause_id,
      cost: this.extraPartsData.cost,
      currency: this.extraPartsData.currency,
      paid_medium: this.bookingData.paid_medium,
      stripe_card_id: this.cardData[0].id
    };
    this.api_service.HttpPostReqHeader('website/extraPartPayment', body_obj, true, this.logtoken).then((response: any) => {
     // console.log("Additional parts online payment responce => ", response);
      if (response.success == true) {
        this.confirmStatus = 1;
        this.spinnerService.hide();
        this.message =  response.message;
        ($('#onlinePayment') as any).modal('hide');
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
      else {
        this.spinnerService.hide();
        ($('#warningModal') as any).modal('show');
      }
    })
  }

  acceptAdditionalTimeRequest(){
    ($('#additonalTimeAccept') as any).modal('hide');
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/acceptExtraDay?token=${this.logtoken}&query_booking_id=${this.queryBookingId}&query_extra_time_id=${this.queryExtraTimeId}`, true)
    .then((response: any) => {
     // console.log("Extra day accept responce => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        this.extraDayConfirmStatus = 1;
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          ($('#successModal') as any).modal('hide');
          this.getQueryBookingDetails(this.queryBookingId);
        }, 4000);
      } else {
        this.spinnerService.hide();
      }
    })
  }

  rejectAditionalTimeRequest(){
    ($('#additonalTimeReject') as any).modal('hide');
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/rejectExtraDay?token=${this.logtoken}&query_booking_id=${this.queryBookingId}&query_extra_time_id=${this.queryExtraTimeId}`, true)
    .then((response: any) => {
      //console.log("Extra day reject responce => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        this.extraDayConfirmStatus = 2;
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          ($('#successModal') as any).modal('hide');
          this.getQueryBookingDetails(this.queryBookingId);
        }, 4000);
      } else {
        this.spinnerService.hide();
      }
    })
  }
  startRating(event: any, count: any){
    if(count == 1){
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1") as any).css("color", "#FFCC36");
    }
    if(count == 2){
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2") as any).css("color", "#FFCC36");
    }
    if(count == 3){
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3") as any).css("color", "#FFCC36");
    }
    if(count == 4){
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3, #star4") as any).css("color", "#FFCC36");
    }
    if(count == 5){
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3, #star4, #star5") as any).css("color", "#FFCC36");
    }
   this.ratingCount = count;
  }
  submitReview(){
    // console.log(this.ratingCount);
    // console.log(this.reviewText);

    this.spinnerService.show();
    const query = {
      booking_id: this.queryBookingId,
      sp_id: this.bookingData.sp_id,
      rating: this.ratingCount,
      review: this.reviewText,
      booking_type: 1,
    }
    this.api_service.HttpPostReqHeader('website/submitReview', query, true, this.logtoken).then((response: any) => {
      //console.log("Review submit responce  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#ratingReviewModal') as any).modal('hide');
        this.message = response.message;
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
            window.location.reload();
        }, 4000);
      } else {
        this.spinnerService.hide();
        ($('#ratingReviewModal') as any).modal('hide');
        this.message = response.message;
        ($('#warningModal') as any).modal('show');
        setTimeout(() => {
          ($('#warningModal') as any).modal('hide');
        }, 4000);
      }
    })
  }
}
