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
  selector: 'app-sp-query-booking-details',
  templateUrl: './sp-query-booking-details.component.html',
  styleUrls: ['./sp-query-booking-details.component.css']
})
export class SpQueryBookingDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  additionalTimeForm: FormGroup;
  additionalPartsForm: FormGroup;
  newNotification = false;
  queryBookingId: any;
  bookingData: any;
  message: any;
  lat: any;
  lng: any;
  spLat: any;
  spLng: any;
  srLat: any;
  srLng: any;
  origin: any;
  destination: any;
  onTheWayChecked = false;
  trackingStatus: any;
  extraPartConfirmStatus = 0;
  adminApprovalStatus: any;
  pauseType: any;
  startStatus: any;
  srAddressId: any;
  additionalTime = false;
  additionalPartsRequired = false;
  urls: any[] = [];
  additionalPartsImgFile: any[] = [];
  pauseImage: any[] = [];
  reviewText = "";
  ratingCount = 0;
  bookingStatus: any;
  extraPartCount: any;
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

  extraTimeCount = 0;
  extraDayConfirmStatus = 0;
  extraTimeSubmit = 0;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private elementRef: ElementRef, private socketService: SocketService, private socket: Socket) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.lng = +pos.coords.longitude;
          this.lat = +pos.coords.latitude;
          this.spLat = this.lat;
          this.spLng = this.lng;
          this.origin = { lat: this.lat, lng: this.lng };
        });
      }
      this.additionalPartsForm = formbuilder.group({
        additional_parts: ['', Validators.compose([Validators.required])],
        reason: ['', Validators.compose([Validators.required])],
        cost: ['', Validators.compose([Validators.required])],
        pause_image: ['', Validators.compose([Validators.required])],
      });
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
      this.queryBookingId = params.query_booking_id;
      this.getMyBookingDetails(this.queryBookingId);
     this.getNewNotification();
    });


    //Socket connection
    this.socket.on('connected', message => {
      if (message == 'Welcome') {
        console.log("socket is connected for SP query service details.....");
        this.socket.on('pause_reason', data => {
          console.log("Pause reson socket responce ====> ", data);
            this.extraPartConfirmStatus = data.confirm_status;
            this.pauseType = 2;
            this.getMyBookingDetails(this.queryBookingId);
            this.additionalPartsRequired = false;
        });

        this.socket.on('admin_approve', data => {
          console.log("pause job reason approval status ===> ", data);
          this.adminApprovalStatus = data.admin_approval_status;
        });

        this.socket.on('rejected', data => {
            this.extraPartConfirmStatus == data.extra_part_confirm_status;
            this.getMyBookingDetails(this.queryBookingId);
        });

        this.socket.on('query_extra_time', data => {
          console.log("query extra time accepted ====> ", data);
            this.extraDayConfirmStatus == data.extra_day_confirm_status;
            this.getMyBookingDetails(this.queryBookingId);
        });

      } else {
        console.log("dddddddddddd");
      }
    });
  }

  getMyBookingDetails(query_booking_id: any) {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/spQueryBookingDetails/?token=${token}&query_booking_id=${query_booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Query Booking Details Responce =>', response.data);
            this.spinnerService.hide();
            this.bookingData = response.data;
            this.bookingStatus = response.data.booking_status;
            this.trackingStatus = response.data.tracking_status;
            this.startStatus = response.data.start_status;
            this.pauseImage = response.data.pause_image ? response.data.pause_image : [];
            this.adminApprovalStatus = response.data.admin_approval_status;
            this.extraPartConfirmStatus = response.data.extra_part_confirm_status;
            this.extraTimeCount = response.data.extra_time_count;
            this.extraDayConfirmStatus = response.data.extra_day_confirm_status;
            this.extraPartCount = response.data.extra_part_count;
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
    this.api_service.HttpGetReq(`website/getSPLocation/?token=${token}&booking_id=${this.queryBookingId}`, true)
      .then(
        (response: any) => {
          //console.log("Sp location => ", response);

          if (response.success == true) {
            this.spLat = parseFloat(response.data.latitude);
            this.spLng = parseFloat(response.data.longitude);
            this.origin = { lat: this.spLat, lng: this.spLng };
           // console.log("origin => ", this.origin);
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
    this.api_service.HttpGetReq(`website/getSRLocation/?token=${token}&address_id=${this.bookingData.address_id}`, true)
      .then(
        (response: any) => {
         //console.log("Sr location => ", response);
          if (response.success == true) {
            this.srLat = parseFloat(response.data.lattitude);
            this.srLng = parseFloat(response.data.longitude);
            this.destination = { lat: this.srLat, lng: this.srLng };
           // console.log("destination => ", this.destination);

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

  onTheWay(event: any) {
    if (event.target.checked) {
      var token = this.logtoken;
      this.spinnerService.show();
      this.api_service.HttpGetReq(`website/spOnTheWayForQueryService/?token=${token}&query_booking_id=${this.queryBookingId}`, true)
        .then(
          (response: any) => {
            if (response.success == true) {
             // console.log('On the way notification responce =>', response);
              this.trackingStatus = 1;
              this.spinnerService.hide();
              this.sendCurrentLocation();
            } else {
              this.spinnerService.hide();
              this.onTheWayChecked = false;
            }
          },
          (error) => {
            this.spinnerService.hide();
          }
        );
    }

  }

  startTracking() {
    //var link = ""+"https://maps.google.com/maps?saddr="+this.spLat+","+this.spLng+" &daddr="+this.srLat+","+this.srLng+"&navigate=yes";
    //var link = "geo:22.2706895,87.664432?saddr=("+this.spLat+","+this.spLng+")&daddr=("+this.srLat+","+this.srLng+")";
    var link = "https://www.google.com/maps/dir/?api=1&origin=" + this.spLat + "," + this.spLng + "&destination=" + this.srLat + "," + this.srLng + "&travelmode=driving";
    window.location.href = link;
  }

  stopTrackingConfirm() {
    this.message = "I have reached the location. Stop tracking location now.";
    ($('#warningModal') as any).modal('show');
  }

  sendCurrentLocation() {
    this.spinnerService.show();
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        var body_obj = { query_booking_id: this.queryBookingId, latitude: this.lat, longitude: this.lng };
        this.api_service.HttpPostReqHeader('website/spLatestLocationPostQueryService', body_obj, true, this.logtoken).then((response: any) => {
          if (response.success == true) {
           // console.log(response.message);
            this.spinnerService.hide();
          }else {
            this.spinnerService.hide();
          }
        })

      });
    }
  }

  stopTracking() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/stopQueryServiceTracking/?token=${token}&query_booking_id=${this.queryBookingId}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
           // console.log('Stop tracking responce =>', response.data);
            this.spinnerService.hide();
            ($('#warningModal') as any).modal('hide');
            this.trackingStatus = 2;
            this.bookingStatus = 2;
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

  startJob(){
    var token = this.logtoken;
    this.spinnerService.show();
    ($('#startJobModal') as any).modal('hide');
    this.api_service.HttpGetReq(`website/startQueryService/?token=${token}&query_booking_id=${this.queryBookingId}`, true)
      .then(
        (response: any) => {
        //  console.log('Start service responce =>', response);
          if (response.success == true) {
            this.spinnerService.hide();
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            this.startStatus = 1;
          } else {
            this.spinnerService.hide();
            this.message = response.message;
            ($('#warningmodal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  changeReason(event: any) {
    if (event.target.value == 'additional-time') {
      this.additionalPartsRequired = false;
      this.additionalTime = true;
    }
    if (event.target.value == 'additional-parts-required') {
      this.additionalTime = false;
      this.additionalPartsRequired = true;
      if(this.extraPartCount == 0 && this.extraPartConfirmStatus == 0){
        this.extraPartConfirmStatus = 1;
      }
    }
  }

  imagePreview(event: any) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        this.additionalPartsImgFile.push(file);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }

  additionalPartsSubmit(pause_type: any) {
    this.additionalPartsRequired = false;
    this.spinnerService.show();
    let form_data = new FormData();
      let formValue = this.additionalPartsForm.value;
      formValue.booking_id = this.queryBookingId;
      formValue.cost = parseInt(formValue.cost);
      formValue.pause_type = pause_type;
      formValue.booking_type = 1;
      form_data.append('extra_part_data', JSON.stringify(formValue));
      if (this.additionalPartsImgFile.length > 0) {
        for (let file of this.additionalPartsImgFile) {
          { form_data.append('pause_image', file); }
        }
      } else {
        form_data.append('pause_image', '');
      }
     // console.log("form data ", formValue);

    this.api_service.HttpPostReqHeader('website/queryServiceExtraParts', form_data, true, this.logtoken).then((response: any) => {
     // console.log("Additional parts reason submit responce ==>  ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        ($('#successModal') as any).modal('show');
        this.getMyBookingDetails(this.queryBookingId);

      } else {
        this.spinnerService.hide();
        ($('#successModal') as any).modal('hide');
        this.message = response.message;
        ($('#warning_modal') as any).modal('show');
      }
    })

  }

  requestForExtraTime(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/queryServiceExtraDay/?token=${this.logtoken}&query_booking_id=${this.queryBookingId}`, true)
      .then(
        (response: any) => {
          //console.log("Query service extra day responce => ", response);

          if (response.success == true) {
            this.extraTimeSubmit = 1;
            this.additionalTime = false;
            this.spinnerService.hide();
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            setTimeout(() => {
              ($('#successModal') as any).modal('hide');
            }, 4000);
            this.getMyBookingDetails(this.queryBookingId);
          } else {
            this.spinnerService.hide();
            ($('#successModal') as any).modal('hide');
            this.message = response.message;
            ($('#warning_modal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  completeJob() {
    this.message = "Are you want to complete the service?";
    ($('#completeServiceModal') as any).modal('show');
  }

  completeService() {
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/completeQueryService/?token=${token}&query_booking_id=${this.queryBookingId}`, true)
      .then(
        (response: any) => {
         // console.log('Complete service responce =>', response);
          if (response.success == true) {
            this.spinnerService.hide();
            ($('#completeServiceModal') as any).modal('hide');
            this.message = response.message;
            ($('#successModal') as any).modal('show');
            setTimeout(() => {
              ($('#successModal') as any).modal('hide');
              ($('#ratingReviewModal') as any).modal('show');
            }, 2000);
            //Modal close with out rating & review submission
            ($('body') as any).click(function (event) {
              if (event.target.id == "ratingReviewModal") {
                //this.router.navigateByUrl('/sp-query-booking-list').then(() => {
                    window.location.reload();
                //});
              }
            });
            // setTimeout(() => {
            //   this.router.navigateByUrl(`/sp-booking-list`).then(() => {
            //     window.location.reload();
            //   });
            // }, 5000);
          } else {
            this.spinnerService.hide();
            ($('#completeServiceModal') as any).modal('hide');
            this.message = response.message;
            ($('#warningmodal') as any).modal('show');
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
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
      booking_id: this.queryBookingId,
      sr_id: this.bookingData.customer_id,
      rating: this.ratingCount,
      review: this.reviewText,
      booking_type: 1,
    }
   // console.log("query => ", query);

    this.api_service.HttpPostReqHeader('website/spSubmitReview', query, true, this.logtoken).then((response: any) => {
     // console.log("Review submit responce  => ", response);
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

  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
        //  console.log('get new notification response => ', response);
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
    //  console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.newNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
