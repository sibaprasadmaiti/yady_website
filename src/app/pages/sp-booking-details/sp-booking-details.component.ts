import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { SocketService } from '../../services/socket.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-sp-booking-details',
  templateUrl: './sp-booking-details.component.html',
  styleUrls: ['./sp-booking-details.component.css']
})
export class SpBookingDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  cancelForm: FormGroup;
  additionalTimeForm: FormGroup;
  additionalPartsForm: FormGroup;
  iWillbeLeatForm: FormGroup;
  booking_id: null;
  bookingData: any;
  trackingStatus: any;
  pauseType: any;
  confirmStatus = 0;
  startStatus: any;
  pauseStatus: any;
  message: any;
  lat: any;
  lng: any;
  onTheWayChecked = false;
  iwillbeLetChecked = false;
  cancel = false;
  workInProgress = false;
  urls: any[] = [];
  cancel_reason: any;
  cancelImage: any[] = [];
  displayTimer = "00:00:00";
  myTimer: any;
  seconds: any;
  minutes: any;
  hours: any;
  secondsLeft: any;
  timerpauseTrue = true;
  timerpauseFalse = false;
  isVisible = true;
  totalServiceTime: any;
  additionalTime = false;
  additionalParts = false;
  additionalTimeCost: any;
  rescheduleService = false;
  rescheduleDate: any;
  selectedTime: any;
  startWorkingTime: any;
  endWorkingTime: any;
  timeSlotArray: any[] = [];
  chooseSlotArray: any[] = [];
  chooseSlots: any[] = [];
  adminApprovalStatus: any;
  spRescheduleAcceptedStatus: any;
  spRescheduleStatus: any;
  additionalPartsSubmitBtn = true;
  additional_parts = "";
  formattedDate: any;
  timeInterval: any;
  startTime_24: any
  reviewText = "";
  ratingCount = 0;
  spLat: any;
  spLng: any;
  srLat: any;
  srLng: any;
  origin: any;
  destination: any;
  srAddressId: any;
  currency = "INR";
  iwillbeleatformOpen = false;
  newNotification = false;
  cancelBookingReasonData: any;
  hourly_price: any = 0;
  hourly_price_tax: any = 0;
  renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#00B2B2', strokeWeight: '6' }
  }

  markerOptions = {
    origin: {
      icon: './assets/images/sr-track.png',
    },
    destination: {
      icon: './assets/images/sp-track.png',
      label: 'Service Requester',
      opacity: 0.8,
    },
  }

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private elementRef: ElementRef, private socketService: SocketService, private socket: Socket) {
    this.cancelForm = formbuilder.group({
      cancel_reason: ['', Validators.compose([Validators.required])],
      cancel_image: ['', Validators.compose([Validators.required])],
    });

    this.additionalTimeForm = formbuilder.group({
      additional_time: ['', Validators.compose([Validators.required])],
      reason: ['', Validators.compose([Validators.required])],
      cost: ['0 '+this.currency, Validators.compose([Validators.required])],
    });

    this.additionalPartsForm = formbuilder.group({
      additional_parts: ['', Validators.compose([Validators.required])],
      reason: ['', Validators.compose([Validators.required])],
      cost: ['', Validators.compose([Validators.required])],
      pause_image: ['', Validators.compose([Validators.required])],
    });

    this.iWillbeLeatForm = formbuilder.group({
      reason: ['', Validators.compose([Validators.required])],
    });

    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.spLat = this.lat;
          this.spLng = this.lng;
          this.origin = { lat: this.lat, lng: this.lng };
      });
    }
  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.route.params.subscribe(params => {
      this.booking_id = params.booking_id;
      this.getMyBookingDetails(this.booking_id);

    });

    this.socket.on('connected', message => {
      if (message == 'Welcome') {
        console.log("socket is connected for SP.....");
        this.socket.on('pause_reason', data => {
          console.log("Pause reson socket responce ====> ", data);
          if (data.confirm_status == 1) {
            console.log("confirm status is 1");
            this.pauseStatus = 1;
            this.confirmStatus == data.confirm_status;
            this.pauseType = 2;
            this.spRescheduleStatus = 1;
            this.additional_parts = "fiuhgirhg"
          }
        });

        this.socket.on('admin_approve', data => {
          console.log("pause job reason approval status ===> ", data);
          if (data.admin_approval_status === 1) {
            this.adminApprovalStatus = data.admin_approval_status;
          }
        });

        this.socket.on('reschedule', data => {
          console.log("pause job reschedule reason approval status ====> ", data);
          if (data.sp_reschedule_accepted_status === 1) {
            this.spRescheduleAcceptedStatus = data.sp_reschedule_accepted_status;
            //this.router.navigateByUrl(`/sp-booking-list`);
          }
        });

        this.socket.on('rejected', data => {
          console.log("pause job reason reject status ====> ", data);
          if (data.confirm_status === 2) {
            this.confirmStatus == data.confirm_status;
          }
        });
      } else {
        console.log("dddddddddddd");
      }
    });

    this.getNewNotification();

  }

  onImgError(event){
    event.target.src = './assets/images/no-image.jpg'
   //Do other stuff with the event.target
   }
  getMyBookingDetails(booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/bookingDetails/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
         // console.log('Booking Details Responce =>', response.data);
          if (response.success == true) {
            this.bookingData = response.data;
            this.trackingStatus = response.data.tracking_status;
            this.startStatus = response.data.start_status;
            this.pauseStatus = response.data.pause_status;
            this.secondsLeft = response.data.seconds_left;
            this.pauseType = response.data.pause_type;
            this.confirmStatus = response.data.confirm_status;
            this.adminApprovalStatus = response.data.admin_approval_status;
            this.spRescheduleAcceptedStatus = response.data.sp_reschedule_accepted_status;
            this.spRescheduleStatus = response.data.sp_reschedule_status;
            this.srAddressId = response.data.address_id;
            this.additionalTime = false;
            this.additionalParts = false;
            this.additional_parts = response.data.additional_parts;
            this.formattedDate = response.data.formatted_date;
            this.currency = response.data.currency;
            if (response.data.booking_status == 2) {
              this.totalServiceTime = this.secondsToHms(response.data.total_work_time_seconds);
            }
            if(response.data.booking_status == 4){
              this.getCancelBookingReason(booking_id);
            }

            this.spinnerService.hide();
            setTimeout(() => {
              if ((response.data.booking_status == 3 || response.data.booking_status == 1) && response.data.start_status == 1 && response.data.timer_display_status) {
                if (response.data.seconds_left > 0) {
                  var callDuration = this.elementRef.nativeElement.querySelector('#time');
                  if (response.data.pause_status == 1) {
                    this.clock(response.data.seconds_left, callDuration, this.timerpauseTrue);
                    clearInterval(this.myTimer);
                    delete this.myTimer;
                  } else {
                    this.clock(response.data.seconds_left, callDuration, this.timerpauseFalse);
                  }
                } else {
                  this.isVisible = false;
                }
              }
            }, 1000);

           // this.getSPLocation();
            this.getSRLocation();

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

  getSPLocation() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSPLocation/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          //console.log("Sp location => ", response);

          if (response.success == true) {
            this.spLat = parseFloat(response.data.latitude);
            this.spLng = parseFloat(response.data.longitude);
            this.origin = { lat: this.spLat, lng: this.spLng };
            //console.log("origin => ", this.origin);
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

  getSRLocation() {
    var token = this.logtoken;
    this.spinnerService.show();
    //console.log("Address id => ", this.srAddressId);

    this.api_service.HttpGetReq(`website/getSRLocation/?token=${token}&address_id=${this.srAddressId}`, true)
      .then(
        (response: any) => {
          //console.log("Sr location => ", response);
          if (response.success == true) {
            this.srLat = parseFloat(response.data.lattitude);
            this.srLng = parseFloat(response.data.longitude);
            this.destination = { lat: this.srLat, lng: this.srLng };
            //console.log("destination => ", this.destination);

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

  showMap() {
    //var link = ""+"https://maps.google.com/maps?saddr="+this.spLat+","+this.spLng+" &daddr="+this.srLat+","+this.srLng+"&navigate=yes";
    //var link = "geo:22.2706895,87.664432?saddr=("+this.spLat+","+this.spLng+")&daddr=("+this.srLat+","+this.srLng+")";
    var link = "https://www.google.com/maps/dir/?api=1&origin=" + this.spLat + "," + this.spLng + "&destination=" + this.srLat + "," + this.srLng + "&travelmode=driving";
    window.location.href = link;
  }

  onTheWay(event: any) {
    if (event.target.checked) {
      var token = this.logtoken;
      this.spinnerService.show();
      this.api_service.HttpGetReq(`website/spOnTheWayNotification/?token=${token}&booking_id=${this.booking_id}`, true)
        .then(
          (response: any) => {
            if (response.success == true) {
              //console.log('On the way notification responce =>', response);
              this.trackingStatus = 1;
              this.spinnerService.hide();
              this.sendCurrentLocation();
            } else {
              this.spinnerService.hide();
              this.message = response.message;
              ($('#onTheWayModal') as any).modal('show');
              this.onTheWayChecked = false;
            }
          },
          (error) => {
            this.spinnerService.hide();
          }
        );
    }

  }

  sendCurrentLocation() {
    this.spinnerService.show();
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        // console.log("lat => ", this.lat);
        // console.log("lng => ", this.lng);
        var body_obj = { booking_id: this.booking_id, latitude: this.lat, longitude: this.lng };
        this.api_service.HttpPostReqHeader('website/spLatestLocationPost', body_obj, true, this.logtoken).then((response: any) => {
         // console.log("Latest location send Responce ====> ", response);
          if (response.success == true) {
            this.spinnerService.hide();
          } else if (response.success == false) {
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
          }
        })

      });
    }
  }

  stopTrackingConfirm() {
    this.message = "I have reached the location. Stop tracking location now.";
    ($('#warningModal') as any).modal('show');
  }

  stopTracking() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/stopTracking/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Stop tracking responce =>', response.data);
            this.spinnerService.hide();
            ($('#warningModal') as any).modal('hide');
            this.trackingStatus = 2;
            this.sendCurrentLocation();
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  changeStatus(event: any) {
    if (event.target.value == 'cancel') {
      this.workInProgress = false;
      this.cancel = true;
    }
    if (event.target.value == 'work-in-prog') {
      this.cancel = false;
      this.workInProgress = true;
    }
  }

  imgFileSelected(event: any) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        this.cancelImage.push(file);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }

  calcelReasonSubmit() {

    this.spinnerService.show();
    let formValue = this.cancelForm.value;
    formValue.booking_id = this.booking_id;
    let form_data = new FormData();
    form_data.append('cancel_data', JSON.stringify(formValue));
    if (this.cancelImage)
      for (let file of this.cancelImage) {
        { form_data.append('cancel_image', file); }
      }

    this.api_service.HttpPostReqHeader('website/cancelBooking', form_data, true, this.logtoken).then((response: any) => {
      //console.log("Booking cancel responce ==>  ", response);

      if (response.success == true) {
        this.spinnerService.hide();
        this.message = "Booking cancel successfully.";
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          this.router.navigateByUrl(`/sp-booking-list`).then(() => {
            window.location.reload();
          });
        }, 5000);
      }
      else {
        this.spinnerService.hide();
      }
    })
  }

  clock(secondTime: any, callDuration: any, pauseStatus: any) {
    var c = secondTime; //Initially set to 1 hour
    if (pauseStatus) {
      this.seconds = c % 60; // Seconds that cannot be written in minutes
      var secondsInMinutes = (c - this.seconds) / 60; // Gives the seconds that COULD be given in minutes
      this.minutes = secondsInMinutes % 60; // Minutes that cannot be written in hours
      this.hours = (secondsInMinutes - this.minutes) / 60;
      if (this.hours.toString().length < 2) this.hours = "0" + this.hours;
      if (this.minutes.toString().length < 2) this.minutes = "0" + this.minutes;
      if (this.seconds.toString().length < 2) this.seconds = "0" + this.seconds;

      callDuration.textContent = this.hours + " : " + this.minutes + " : " + this.seconds;
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

        callDuration.textContent = this.hours + " : " + this.minutes + " : " + this.seconds;
        if (c == 0) {
          clearInterval(this.myTimer);
        }
      }
    }
  }

  startTimer() {
    this.message = "Are you want to start the service?";
    ($('#startTimerModal') as any).modal('show');
  }

  pauseTimer() {
    this.message = "Are you want to pause the service?";
    ($('#pauseTimerModal') as any).modal('show');
  }

  resumeTimer() {
    this.message = "Are you want to resume the service?";
    ($('#resumeTimerModal') as any).modal('show');
  }

  completeJob() {
    this.message = "Are you want to complete the service?";
    ($('#completeServiceModal') as any).modal('show');
  }

  startService() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/startService/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
           // console.log('Start service responce =>', response);
            this.spinnerService.hide();
            ($('#startTimerModal') as any).modal('hide');
            this.getMyBookingDetails(this.booking_id);
          } else {
            this.spinnerService.hide();
            ($('#startTimerModal') as any).modal('hide');
            this.message = response.message;
            ($('#jobNotStartedModal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();

        }
      );
  }

  pauseService() {
    if (this.startStatus) {
      var token = this.logtoken;
      this.spinnerService.show();
      this.api_service.HttpGetReq(`website/pauseService/?token=${token}&booking_id=${this.booking_id}`, true)
        .then(
          (response: any) => {
            if (response.success == true) {
              //console.log('Pause service responce =>', response.data);
              this.spinnerService.hide();
              ($('#pauseTimerModal') as any).modal('hide');
              this.getMyBookingDetails(this.booking_id);
            } else {
              this.spinnerService.hide();
            }
          },
          (error) => {
            this.spinnerService.hide();
          }
        );
    } else {
      ($('#pauseTimerModal') as any).modal('hide');
      this.message = "Job has not started yet.";
      ($('#jobNotStartedModal') as any).modal('show');
    }
  }

  resumeService() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/resumeService/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          //console.log('Resume service responce =>', response);
          if (response.success == true) {
            this.spinnerService.hide();
            ($('#resumeTimerModal') as any).modal('hide');
            this.getMyBookingDetails(this.booking_id);
          } else {
            this.spinnerService.hide();
            ($('#resumeTimerModal') as any).modal('hide');
            this.message = response.message;
            ($('#warning_modal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  completeService() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/completeService/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Complete service responce =>', response.data);
            this.spinnerService.hide();
            ($('#completeServiceModal') as any).modal('hide');
            this.message = "Service Completed.";
            ($('#successModal') as any).modal('show');
            setTimeout(() => {
              ($('#successModal') as any).modal('hide');
              ($('#ratingReviewModal') as any).modal('show');
            }, 2000);
            //Modal close with out rating & review submission
            ($('body') as any).click(function (event) {
              if (event.target.id == "ratingReviewModal") {
                window.location.reload();
              }
            });
            // setTimeout(() => {
            //   this.router.navigateByUrl(`/sp-booking-list`).then(() => {
            //     window.location.reload();
            //   });
            // }, 5000);
          } else {
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

  changePauseReason(event: any) {
    if (event.target.value == 'Additional time') {
      this.additionalParts = false;
      this.additionalTime = true;
    }
    if (event.target.value == 'Additional parts required') {
      this.additionalTime = false;
      this.additionalParts = true;
    }
    //console.log(this.additional_parts);

  }

  hourlyPrice(min: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/hourlyPrice/?token=${token}&booking_id=${this.booking_id}&minutes=${min}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Hourly price responce =>', response);
            this.spinnerService.hide();
            this.additionalTimeForm.get('cost').setValue(response.Data + ' '+ this.currency);
            this.hourly_price = response.Data;
            this.hourly_price_tax = response.Taxpercentage;
          } else {
            this.spinnerService.hide();
            this.message = response.message;
            ($('#warning_modal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  rescheduleButton(num: any) {
    if (num == 1) {
      this.rescheduleService = false;
    }
    if (num == 2) {
      this.rescheduleService = true;
    }
  }

  calenderOpen(bookingDate: any) {
    this.additionalPartsSubmitBtn = false;
   // console.log("booking date => ", bookingDate);

    var todaydate = new Date();
    // var date = new Date(bookingDate);
    var tomorrow = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() + 1);
    var upcommingDate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() + 3);
    // if (upcommingDate > todaydate) {
    //   tomorrow = todaydate;
    // } else {
    //   tomorrow = upcommingDate;
    // }

    const component = this;
    // if (tomorrow == upcommingDate) {
    //   this.message = "Your reschedule time is over.";
    //   ($('#warning_modal') as any).modal('show');
    //   setTimeout(() => {
    //     ($('#warning_modal') as any).modal('hide');
    //   }, 4000);
    // } else {
    (($("#spcalendar") as any).datepicker({
      // todayHighlight: true,
      weekStart: 1,
      //minDate:new Date()
      startDate: tomorrow,
      endDate: upcommingDate,
    }) as any).on({
      'changeDate': function (e) {
        if (typeof (e.date) == "undefined")
          return false;
        var selectedDate = moment(e.date).format('YYYY-MM-DD');
        this.selectedTime = selectedDate;
        component.getWorkingTimes(selectedDate);
      }
    });
    //}

  }

  pauseReschedule(event: any) {
    event.target.disabled = true;
    if(this.chooseSlots.length == 3){
      var body_obj = { booking_id: this.booking_id, reschedule_date_arr: this.chooseSlots };
      // this.api_service.HttpPostReqHeader('website/pauseReschedule', body_obj, true, this.logtoken).then((response: any) => {
      //   console.log("Pause reschedule responce ==>  ", response);
      //   if (response.success == true) {
      //     this.spinnerService.hide();
      //     this.message = response.message;
      //     ($('#successModal') as any).modal('show');
      //     setTimeout(() => {
      //       ($('#successModal') as any).modal('hide');
      //       //this.router.navigateByUrl(`/sp-booking-list`);
      //       window.location.reload();
      //     }, 5000);
      //   } else {
      //     this.spinnerService.hide();
      //   }
      // })
    }else{
      this.message = "Please choose three reschedule date and time.";
      ($('#warning_modal') as any).modal('show');
    }

  }

  pauseReasonSubmit(pause_type: any) {
    this.spinnerService.show();
    let form_data = new FormData();
    if (pause_type == 1) {
      let formValue = this.additionalTimeForm.value;
      formValue.booking_id = this.booking_id;
      formValue.cost = parseInt(formValue.cost);
      formValue.pause_type = pause_type;
      formValue.additional_parts = "";
      formValue.sp_reschedule_status = "";
      form_data.append('pause_reason_data', JSON.stringify(formValue));
    }
    if (pause_type == 2) {
      let formValue = this.additionalPartsForm.value;
      formValue.booking_id = this.booking_id;
      formValue.cost = parseInt(formValue.cost);
      formValue.pause_type = pause_type;
      formValue.sp_reschedule_status = "";
      if (this.spRescheduleStatus == 1)
        formValue.sp_reschedule_status = 1;
      form_data.append('pause_reason_data', JSON.stringify(formValue));
      if (this.cancelImage.length > 0) {
        for (let file of this.cancelImage) {
          { form_data.append('pause_image', file); }
        }
      } else {
        form_data.append('pause_image', '');
      }
     // console.log("form data ", formValue);
    }

    this.api_service.HttpPostReqHeader('website/pauseServiceReason', form_data, true, this.logtoken).then((response: any) => {
     // console.log("Pause service reason responce ==>  ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        ($('#successModal') as any).modal('show');
        this.getMyBookingDetails(this.booking_id);
      } else {
        this.spinnerService.hide();
        ($('#successModal') as any).modal('hide');
        this.message = response.message;
        ($('#warning_modal') as any).modal('show');
      }
    })

  }

  getWorkingTimes(date: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getWorkingTime/?token=${token}&date=${date}`, true)
      .then(
        (response: any) => {
          //console.log('Working time responce =>', response);
          if (response.success == true) {
            this.spinnerService.hide();
            this.startWorkingTime = response.Data.start_time_24;
            this.endWorkingTime = response.Data.end_time_24;
            this.timeInterval = response.Data.time_interval;
            // console.log("start time => ", response.Data.start_time_24);
            // console.log("end time => ", response.Data.end_time_24);

            this.timeSlotGenerate(date, this.startWorkingTime, this.endWorkingTime);
          } else {
            this.spinnerService.hide();
            this.message = response.message;
            ($('#warning_modal') as any).modal('show');
            setTimeout(() => {
              ($('#warning_modal') as any).modal('hide');
            }, 4000);
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  timeSlotGenerate(chooseDate: any, startTime: any, endTime: any) {

    //Start time ceil
    var date = new Date(chooseDate + ' ' + startTime);  //or use any other date
    let hr = date.getHours();
    var start_time = moment(hr + ':00', 'HH:mm').format('HH:mm');
    if (date.getMinutes() > 0) {
      start_time = moment(hr + ':00', 'HH:mm').add(1, 'hours').format('HH:mm');
    }

    //End time round
    var enddate = new Date(chooseDate + ' ' + endTime);  //or use any other date
    let enhr = enddate.getHours();
    var end_time = moment(enhr + ':00', 'HH:mm').format('HH:mm');
    // if(enddate.getMinutes() > 30){
    //   end_time = moment(enhr+':00','HH:mm').add(1, 'hours').format('HH:mm');
    // }


    var start_time1 = this.parseTime(start_time);
    var end_time1 = this.parseTime(end_time);
    this.timeSlotArray = [];
    this.calculate_time_slot(chooseDate, start_time1, end_time1, this.timeInterval);

  }

  chooseSlot(datetime: any, date: any, time: any) {
    if (this.chooseSlotArray.length < 3) {
      var token = this.logtoken;
      this.spinnerService.show();
      this.api_service.HttpGetReq(`website/chkBookingExists/?token=${token}&date=${date}&time=${time}&booking_id=${this.booking_id}`, true)
        .then(
          (response: any) => {
            //console.log('Check booking exists responce =>', response);
            if (response.success == true) {
              this.spinnerService.hide();
              if(this.chooseSlotArray.includes(datetime)){
                this.message = "You have already chosen this date and time, please choose another.";
                ($('#warning_modal') as any).modal('show');
              }else{
                this.chooseSlotArray.push(datetime);
                this.chooseSlots.push(date + ' ' + time);
              }

            } else {
              this.spinnerService.hide();
              this.message = response.message;
              ($('#jobNotStartedModal') as any).modal('show');
            }
          },
          (error) => {
            this.spinnerService.hide();
          }
        );
    } else {
      console.log(this.chooseSlots);

      this.message = "Please choose only three date and time.";
      ($('#jobNotStartedModal') as any).modal('show');
    }
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
    var i, formatted_time;
    for (var i = start_time; i <= end_time; i = i + interval) {
      formatted_time = this.convertHours(i);
      // formatted_time = this.tConvert(formatted_time);
      let result = moment(formatted_time, "HH:mm").format('h:mm A');
      let datetime = moment(chooseDate + ' ' + formatted_time, "YYYY-MM-DD HH:mm").format('dddd, D MMMM, YYYY, h:mm A');
      let date = moment(chooseDate, "YYYY-MM-DD").format('YYYY-MM-DD');
      let time = moment(formatted_time, "HH:mm").format('h:mm A');
      this.timeSlotArray.push({
        result,
        datetime,
        date,
        time
      })
      //this.timeSlotArray.push(formatted_time);
    }
    //console.log("Time slot array ====> ", this.timeSlotArray);
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  todayDateFormat(today) {
    //var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1; // Months start at 0!
    var dd = today.getDate();
    var hrs = today.getHours();
    var min = today.getMinutes();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hrs < 10) hrs = '0' + hrs;
    if (min < 10) min = '0' + min;

    var dateString = hrs + ':' + min;
    return dateString;
  }

  startRating(event: any, count: any) {
    if (count == 1) {
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1") as any).css("color", "#FFCC36");
    }
    if (count == 2) {
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2") as any).css("color", "#FFCC36");
    }
    if (count == 3) {
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3") as any).css("color", "#FFCC36");
    }
    if (count == 4) {
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3, #star4") as any).css("color", "#FFCC36");
    }
    if (count == 5) {
      ($(".fa-star") as any).css("color", "#ccc");
      ($("#star1, #star2, #star3, #star4, #star5") as any).css("color", "#FFCC36");
    }
    this.ratingCount = count;
  }

  writeReview() {
    ($('#ratingReviewModal') as any).modal('show');
  }

  submitReview() {
    this.spinnerService.show();
    const query = {
      booking_id: this.booking_id,
      sr_id: this.bookingData.customer_id,
      rating: this.ratingCount,
      review: this.reviewText
    }
    //console.log("query => ", query);

    this.api_service.HttpPostReqHeader('website/spSubmitReview', query, true, this.logtoken).then((response: any) => {
      //console.log("Review submit responce  => ", response);
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
        ($('#warning_modal') as any).modal('show');
        setTimeout(() => {
          ($('#warning_modal') as any).modal('hide');
        }, 4000);
      }
    })
  }

  iWillBeLeat(event: any) {
    if (event.target.checked) {
      this.iwillbeleatformOpen = true;
    } else {
      this.iwillbeleatformOpen = false;
    }
  }

  iWillBeLateSubmit(){
    let formValue = this.iWillbeLeatForm.value;
    formValue.booking_id = this.booking_id;
    this.api_service.HttpPostReqHeader('website/spLate', formValue, true, this.logtoken).then((response: any) => {
     // console.log("I'll be late ==>  ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        ($('#successModal') as any).modal('show');

      } else {
        this.spinnerService.hide();
        ($('#successModal') as any).modal('hide');
        this.message = response.message;
        ($('#warning_modal') as any).modal('show');
      }
    })
  }

  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         // console.log('get new notification response => ', response);
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
