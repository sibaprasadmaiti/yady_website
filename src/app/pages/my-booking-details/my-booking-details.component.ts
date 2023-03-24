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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-booking-details',
  templateUrl: './my-booking-details.component.html',
  styleUrls: ['./my-booking-details.component.css']
})

export class MyBookingDetailsComponent implements OnInit {

  logtoken = localStorage.getItem('LoginToken');
  booking_id: null;
  bookingData: any;
  myTimer: any;
  displayTimer: any;
  seconds: any;
  minutes: any;
  hours: any;
  openModal = false;
  isVisible = true;
  timerpauseTrue = true;
  timerpauseFalse = false;
  serviceCompleteMsg: any;
  pauseData: any;
  pauseType: any;
  confirmStatus: any;
  spRescheduleStatus: any;
  spRescheduleAcceptedStatus: any;
  $: any;
  cardData: any;
  message: any;
  pauseRescheduleDates: any;
  rescheduleDateId: any;
  adminApprovalStatus = 0;
  chkRescheduleData: any;
  chkRescheduleDetails: any;
  getRescheduleDate ="";
  getRescheduleTime ="";
  getRescheduleReason ="";
  dateError = false;
  timeError = false;
  reasonError = false;
  reviewText = "";
  ratingCount = 0;
  cancelBookingReasonData: any;
  timeSlotArray: any[] = [];
  showSlot = false;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private elementRef: ElementRef, private socketService: SocketService, private socket: Socket, private translateService: TranslateService) {

  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    //Booking details & Check reschedule function call
    this.route.params.subscribe(params => {
      this.booking_id = params.booking_id;
      this.getMyBookingDetails(this.booking_id);
      this.checkBookingReschedule(this.booking_id);
    });

    //Socket Connection
    this.socket.on('connected', message => {
      if (message == 'Welcome') {
       // console.log("socket is connected for timer.....");
        this.socket.on('pause_service', data => {
          if (data.pause_status == 1) {
            clearInterval(this.myTimer);
            delete this.myTimer;
            console.log("service is paused.......");
          } else {
            var callDuration = this.elementRef.nativeElement.querySelector('#time');
            this.clock(data.seconds_left, callDuration, false);
            console.log("service is running.......");
          }
        });
        this.socket.on('pause_reason', pauseReson => {
          console.log("Pause reson => ", pauseReson);
          if (pauseReson.confirm_status == 0) {
            this.getPauseData(this.booking_id);
          }

        });
        this.socket.on('rejected', data => {
          console.log("rejected => ", data);
          this.confirmStatus = data.confirm_status;
        });
        this.socket.on('reschedule', data => {
          console.log("Reschedule => ", data);
          this.spRescheduleStatus = data.sp_reschedule_status;
          this.spRescheduleAcceptedStatus = data.sp_reschedule_accepted_status;
          if (data.sp_reschedule_status == 1) {
            this.getPauseRescheduleDates();
          }
        });
        this.socket.on('complete_service', completeService => {
          if (completeService.start_status == 2) {
            clearInterval(this.myTimer);
            delete this.myTimer;
            this.isVisible = false;
            this.serviceCompleteMsg = this.translateService.instant("Your Service has been completed by the Service Provider");
            setTimeout(() => {
              ($('#ratingReviewModal') as any).modal('show');
            }, 1000);
            //Modal close with out rating & review submission
            ($('body') as any).click(function (event){
              if(event.target.id == "ratingReviewModal"){
                  window.location.reload();
              }
            });
          }
        });
        this.socket.on('disconnect', disconnectData => {
          console.log("Socket is disconnect");
        });
      }
    });
  }

  getMyBookingDetails(booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/myBookingDetails/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('My Booking Details Responce =>', response.data);
            this.bookingData = response.data;
            this.getCancelBookingReason(booking_id);
            setTimeout(() => {
              if ((response.data.booking_status == 3 || response.data.booking_status == 1) && response.data.start_status == 1 && response.data.timer_display_status) {
                if (response.data.seconds_left > 0) {
                  var callDuration = (<HTMLInputElement>document.getElementById('timer'));
                  if (response.data.pause_status == 1) {
                    this.clock(response.data.seconds_left, callDuration, this.timerpauseTrue);
                  } else {
                    this.clock(response.data.seconds_left, callDuration, this.timerpauseFalse);
                  }
                } else {
                  this.isVisible = false;
                }
              }

            }, 1000);

            //For rating & review
          //   setTimeout(() => {
          //   if(response.data.booking_status == 2 && (response.data.rating == null || response.data.review == null)){
          //     ($('#ratingReviewModal') as any).modal('show');
          //   }
          // }, 2000);

            if ((response.data.pause_type == 1 || response.data.pause_type == 2)) {
              this.getPauseData(booking_id);
            }
            this.pauseType = response.data.pause_type;
            this.spRescheduleStatus = response.data.sp_reschedule_status;
            this.spRescheduleAcceptedStatus = response.data.sp_reschedule_accepted_status;
            this.confirmStatus = response.data.confirm_status;


            if(response.data.sp_reschedule_status == 1){
              this.getPauseRescheduleDates();
            }

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

  getCancelBookingReason(booking_id: any){
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getCancelBookingReason/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
          //console.log('Cancel booking Responce =>', response);
          if (response.success == true) {
            this.cancelBookingReasonData = response.data;
            this.spinnerService.hide();
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  onImgError(event){
    event.target.src = './assets/images/pic1.png';
   //Do other stuff with the event.target
   }

  checkBookingReschedule(booking_id: any){
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkReschedule/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
          //console.log('chkReschedule Responce =>', response);
          if (response.success == true) {
            this.chkRescheduleData = response.data;
            this.chkRescheduleDetails = response.cat_subcat_details;
            this.spinnerService.hide();
          } else {
            this.chkRescheduleData = {};
            this.chkRescheduleDetails = {};
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  cancelBooking() {
    ($('#cancelBookingAlert') as any).modal('hide');
    if(this.bookingData.paid_medium == 2){
      this.walletRefund();
    }
    if(this.bookingData.paid_medium == 1){
      ($('#cancelBookingOnlineRefund') as any).modal('show');
    }
    // var token = this.logtoken;
    // this.spinnerService.show();
    // this.api_service.HttpGetReq(`website/myBookingCancel/?token=${token}&booking_id=${booking_id}`, true)
    //   .then(
    //     (response: any) => {
    //       if (response.success == true) {
    //         console.log('responce data  => ', response.data);
    //         //this.bookingData = response.data;
    //         this.router.navigateByUrl(`/my-booking-list`);
    //         this.spinnerService.hide();
    //       } else {
    //         //this.bookingData = [];
    //         this.spinnerService.hide();
    //       }
    //     },
    //     (error) => {
    //       this.spinnerService.hide();
    //     }
    //   );
  }

  walletRefund(){
    ($('#cancelBookingOnlineRefund') as any).modal('hide');
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/walletRefund/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            this.spinnerService.hide();
            //console.log('wallet refund responce => ', response.data);
            this.message = response.message;
            ($('#aditionalPayment') as any).modal('show');
            setTimeout(() => {
              this.router.navigateByUrl(`/my-booking-list`).then(() => {
                window.location.reload();
              })
            }, 4000);
          } else {
            //this.bookingData = [];
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  cardRefund(){
    ($('#cancelBookingOnlineRefund') as any).modal('hide');
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/cardRefund/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            this.spinnerService.hide();
            //console.log('card refund responce => ', response.data);
            this.message = response.message;
            ($('#aditionalPayment') as any).modal('show');
            setTimeout(() => {
              this.router.navigateByUrl(`/my-booking-list`).then(() => {
                window.location.reload();
              })
            }, 4000);

          } else {
            //this.bookingData = [];
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  rescheduleBooking(booking_date: any){
   // console.log("available dates array....",this.chkRescheduleDetails.available_dates);
    var enabledDates = this.chkRescheduleDetails.available_dates
    const component = this;
    var date = new Date(booking_date);
    var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    var upcommingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 33);
    if(this.chkRescheduleDetails.available_dates.length > 0){
      (($("#calendarOpen") as any).datepicker({
        // todayHighlight: true,
        weekStart: 1,
        //minDate:new Date()
         startDate: tomorrow,
         endDate: upcommingDate,
        // multidate: true,
        //beforeShowDay: this.chkRescheduleDetails.available_dates
        beforeShowDay: function(date) {
          var sdate = moment(date).format('YYYY-MM-DD');
          if ($.inArray(sdate, enabledDates) !== -1) {
            return {
              enabled: true
            }
          } else {
            return {
              enabled: false
            }
          }
        }
      }) as any).on({
        'changeDate': function (e) {
          if (typeof (e.date) == "undefined")
            return false;
            component.showSlot = true;
            var selectedDate = moment(e.date).format('YYYY-MM-DD');
            component.getRescheduleDate = selectedDate;
            component.getWorkingTimeForSR(selectedDate);
        }
      });
    }else{
      (($("#calendarOpen") as any).datepicker({
        // todayHighlight: true,
        weekStart: 1,
        //minDate:new Date()
         startDate: tomorrow,
      }) as any).on({
        'changeDate': function (e) {
          if (typeof (e.date) == "undefined")
            return false;
            component.showSlot = true;
            var selectedDate = moment(e.date).format('YYYY-MM-DD');
            component.getRescheduleDate = selectedDate;
            component.getWorkingTimeForSR(selectedDate);
        }
      });
    }

    ($('#rescheduleBooking') as any).modal('show');
  }

  getWorkingTimeForSR(selectedDate: any){
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getWorkingTimeForSR/?token=${token}&booking_id=${this.booking_id}&date=${selectedDate}`, true)
      .then(
        (response: any) => {
          //console.log('get working time for choosen date Responce =>', response);
          if (response.success == true) {

            //Start time ceil
            var date = new Date(selectedDate + ' ' + response.data.start_time_24);  //or use any other date
            let hr = date.getHours();
            var start_time = moment(hr+':00','HH:mm').format('HH:mm');
            if(date.getMinutes() > 30){
              start_time = moment(hr+':00','HH:mm').add(1, 'hours').format('HH:mm');
            }

            //End time round
            var enddate = new Date(selectedDate + ' ' + response.data.end_time_24);  //or use any other date
            let enhr = enddate.getHours();
            var end_time = moment(enhr+':00','HH:mm').format('HH:mm');
            if(enddate.getMinutes() > 30){
              end_time = moment(enhr+':00','HH:mm').add(1, 'hours').format('HH:mm');
            }

             //Parse Time & Interval
             var start_time1 = this.parseTime(start_time);
             var end_time1 = this.parseTime(end_time);
             var interval1 = response.data.time_interval;
             this.calculate_time_slot(selectedDate, start_time1, end_time1, interval1);

            this.spinnerService.hide();
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  getTime(event: any, time: any){
    var oldActive = document.getElementsByClassName("current");
			for (var i = 0; i < oldActive.length; i++) {
				oldActive[i].classList.remove("current");
			}
		$(event.target).addClass('current');
    this.getRescheduleTime = time;
  }

  rescheduleReson(reason: any){
    this.getRescheduleReason = reason;
  }

  confirmRescheduling(){

    if(this.getRescheduleDate == ""){
      this.dateError = true;
      return false;
    }else{
      this.dateError = false;
    }
    if(this.getRescheduleTime == ""){
      this.timeError = true;
      return false;
    }else{
      this.timeError = false;
    }
    if(this.getRescheduleReason == ""){
      this.reasonError = true;
      return false;
    }else{
      this.reasonError = false;
    }
    this.spinnerService.show();
    const query = {
      booking_id: this.booking_id,
      reschedule_date: this.getRescheduleDate,
      reschedule_time: this.getRescheduleTime,
      reschedule_reason: this.getRescheduleReason,
      reschedule_amount: this.chkRescheduleData.amount,
    }
    this.api_service.HttpPostReqHeader('website/bookingReschedule', query, true, this.logtoken).then((response: any) => {
      //console.log("reschedule booking save responce  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#rescheduleBooking') as any).modal('hide');
        if(this.chkRescheduleData.amount == 0){
          this.confirmReschedule();
        }else{
          this.getSavedCards();
          ($('#reschedulePayment') as any).modal('show');
        }
      } else {
        this.spinnerService.hide();
      }
    })

  }

  confirmReschedule(){
    this.spinnerService.show();
    var stripe_card_id = "";
    if(this.chkRescheduleData.amount > 0){
      stripe_card_id = this.cardData[0].id;
    }
    const query = {
      booking_id: this.booking_id,
      stripe_card_id: stripe_card_id,
      amount: this.chkRescheduleData.amount,
      currency: this.chkRescheduleDetails.currency,
    }
    this.api_service.HttpPostReqHeader('website/confirmReschedule', query, true, this.logtoken).then((response: any) => {
      //console.log("reschedule booking confirm responce  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        ($('#aditionalPayment') as any).modal('show');
        setTimeout(() => {
          this.router.navigateByUrl(`/my-booking-list`).then(() => {
            window.location.reload();
          })
        }, 5000);
      } else {
        this.spinnerService.hide();
      }
    })
  }

  clock(secondTime: any, callDuration: any, pauseStatus: any) {
    var c = secondTime; //Initially set to 1 hour
   // ($('#timer') as any).html(123);
    if (pauseStatus) {
      this.seconds = c % 60; // Seconds that cannot be written in minutes
      var secondsInMinutes = (c - this.seconds) / 60; // Gives the seconds that COULD be given in minutes
      this.minutes = secondsInMinutes % 60; // Minutes that cannot be written in hours
      this.hours = (secondsInMinutes - this.minutes) / 60;
      if (this.hours.toString().length < 2) this.hours = "0" + this.hours;
      if (this.minutes.toString().length < 2) this.minutes = "0" + this.minutes;
      if (this.seconds.toString().length < 2) this.seconds = "0" + this.seconds;

      callDuration.textContent = this.hours + "h " + this.minutes + "m " + this.seconds + "s";
      //($('#timer') as any).html(this.hours + "h " + this.minutes + "m " + this.seconds + "s");
    } else {
      this.myTimer = setInterval(myClock, 1000);
      function myClock() {
        --c
        this.seconds = c % 60; // Seconds that cannot be written in minutes
        var secondsInMinutes = (c - this.seconds) / 60; // Gives the seconds that COULD be given in minutes
        this.minutes = secondsInMinutes % 60; // Minutes that cannot be written in hours
        this.hours = (secondsInMinutes - this.minutes) / 60;
        if (this.hours.toString().length < 2) this.hours = "0" + this.hours;
        if (this.minutes.toString().length < 2) this.minutes = "0" + this.minutes;
        if (this.seconds.toString().length < 2) this.seconds = "0" + this.seconds;
       // ($('#timer') as any).html(this.hours + "h " + this.minutes + "m " + this.seconds + "s");
        callDuration.textContent = this.hours + "h " + this.minutes + "m " + this.seconds + "s";
        if (c == 0) {
          clearInterval(this.myTimer);
        }
      }
    }




  }

  startTracking(booking_id: any) {
    this.router.navigateByUrl(`/tracking/${booking_id}`);
  }

  getPauseData(booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getPauseData/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Pause Data Responce =>', response.data);
            this.pauseData = response.data;
            this.pauseType = response.data.pause_type;
            this.adminApprovalStatus = response.data.admin_approval_status;

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

  payment(booking_id: any, booking_pause_id: any, cost: any, currency: any, paid_medium: any) {
    if (paid_medium == 1) {
      ($('#onlinePayment') as any).modal('show');
      this.getSavedCards();
    }
    if (paid_medium == 2) {
      this.spinnerService.show();
      var body_obj = { booking_id: booking_id, booking_pause_id: booking_pause_id, cost: cost, currency: currency, paid_medium: paid_medium };
      this.api_service.HttpPostReqHeader('website/extraPayment', body_obj, true, this.logtoken).then((response: any) => {
        //console.log("Additional payment responce => ", response);

        if (response.success == true) {
          this.spinnerService.hide();
          this.confirmStatus = 1;
          this.message = "Please Pay The SP After Job is Completed";
          ($('#aditionalPayment') as any).modal('show');
          setTimeout(() => {
            ($('#aditionalPayment') as any).modal('hide');
          }, 5000);
        } else if (response.success == false) {
          this.spinnerService.hide();
        }
        else {
          this.spinnerService.hide();
        }
      })
    }
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
          console.log('cardData => ', this.cardData);
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

  onlinePayment(booking_id: any, booking_pause_id: any, cost: any, currency: any, paid_medium: any) {
    this.spinnerService.show();
    var body_obj = { booking_id: booking_id, booking_pause_id: booking_pause_id, cost: cost, currency: currency, paid_medium: paid_medium, stripe_card_id: this.cardData[0].id };
    this.api_service.HttpPostReqHeader('website/extraPayment', body_obj, true, this.logtoken).then((response: any) => {
     // console.log("Additional payment online responce => ", response);

      if (response.success == true) {

        this.confirmStatus = 1;
        this.spinnerService.hide();
        this.message = this.translateService.instant("Quotation Payment Successful");
        ($('#onlinePayment') as any).modal('hide');
        ($('#aditionalPayment') as any).modal('show');
        setTimeout(() => {
          ($('#aditionalPayment') as any).modal('hide');
        }, 5000);
      } else if (response.success == false) {
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  rejectAditionalTime(booking_id: any, booking_pause_id: any) {
    var body_obj = { booking_id: booking_id, booking_pause_id: booking_pause_id };
    //this.api_service.HttpPostReqHeader('website/rejectQuotation', body_obj, true, this.logtoken)
    this.api_service.HttpGetReq(`website/getSavedCards?token=${this.logtoken}&booking_id=${booking_id}&booking_pause_id=${booking_pause_id}`, true)
    .then((response: any) => {
      //console.log("Reject responce => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.confirmStatus = 2;
        this.message = this.translateService.instant("Quotation Rejected");
        ($('#aditionalPayment') as any).modal('show');
        setTimeout(() => {
          ($('#aditionalPayment') as any).modal('hide');
        }, 5000);
      } else if (response.success == false) {
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  getPauseRescheduleDates() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getPauseRescheduleDates/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
           // console.log('Get pause reschedule dates =>', response.data.pause_reschedule_dates);
            this.pauseRescheduleDates = response.data.pause_reschedule_dates;
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

  rescheduleDataId(reschedule_date_id: any){
    console.log(reschedule_date_id);

    this.rescheduleDateId = reschedule_date_id;
  }

  acceptRescheduleDate(){
    var token = this.logtoken;
    this.spinnerService.show();
    console.log("this.rescheduleDateId => ", this.rescheduleDateId);

    this.api_service.HttpGetReq(`website/acceptRescheduleDate/?token=${token}&booking_id=${this.booking_id}&reschedule_date_id=${this.rescheduleDateId}`, true).then((response: any) => {
      //console.log("Accept Reschedule Date => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = this.translateService.instant("Reschedule Accepted");
        ($('#aditionalPayment') as any).modal('show');
        this.spRescheduleAcceptedStatus = 1;
        setTimeout(() => {
          ($('#aditionalPayment') as any).modal('hide');
        }, 5000);
      } else if (response.success == false) {
        this.spinnerService.hide();
      }
      else {
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
    console.log(this.ratingCount);
    console.log(this.reviewText);

    this.spinnerService.show();
    const query = {
      booking_id: this.booking_id,
      sp_id: this.bookingData.sp_id,
      rating: this.ratingCount,
      review: this.reviewText
    }
    this.api_service.HttpPostReqHeader('website/submitReview', query, true, this.logtoken).then((response: any) => {
      //console.log("Review submit responce  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#ratingReviewModal') as any).modal('hide');
        this.message = response.message;
        ($('#aditionalPayment') as any).modal('show');
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

  parseTime(s: any) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  convertHours(mins: any) {
    var hour = Math.floor(mins / 60);
    var mins1 = mins % 60;
    var converted = this.pad(hour, 2) + ':' + this.pad(mins1, 2);
    return converted;
  }

  pad(str: any, max: any) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  calculate_time_slot(chooseDate: any, start_time: any, end_time: any, interval: any) {
    this.timeSlotArray = [];
    var i, formatted_time;
    if(interval){
      interval = interval;
    }else{
      interval = 30;
    }
    for (var i = start_time; i <= end_time; i = i + interval) {
      formatted_time = this.convertHours(i);
      let result = moment(formatted_time, "HH:mm").format('h:mm A');
      this.timeSlotArray.push({
        result
      })
    }
    console.log("Time slot array ====> ", this.timeSlotArray);
  }

}
