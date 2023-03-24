import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  showCardDiv: Boolean = true;
  //showCashDiv: Boolean = false;
  logtoken = localStorage.getItem('LoginToken');
  user_id = localStorage.getItem('userID');
  total_price;
  card_error_msg;
  card_status;
  booking_id;
  body_obj;
  cardData;
  infoMessage = "";
  infoMessageRed = "";
  currency: any;
  saveBookingJobNo: any;
  booking_data: any;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.paymentForm = formbuilder.group({
      card_number: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      month: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      year: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      cvc: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    });

  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }

    this.route.params.subscribe(params => {
      this.booking_id = params.booking_id;
    });
    this.getBookingSummary();
    this.getSavedCards();
  }
  getBookingSummary() {
    var token = this.logtoken;
    var booking_id = this.booking_id;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/bookingSummary/?token=${token}&booking_id=${booking_id}`, true)
      .then(
        (response: any) => {
          console.log('booking summary', response);
          if (response.success) {
            this.spinnerService.hide();
            this.booking_data = response.data;
            this.total_price = response.data.total_cost;
            this.currency = response.currency;
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
          /*this.toastr.error('Internal server error');
          this.snackBar.open('Internal server error', 'End now', {
          duration: 5000,
          });*/
        });
  }

  showCard() {
    this.showCardDiv = true;
    //this.showCashDiv = false;
  }
  // showCash() {
  // 	this.showCardDiv = false;
  // 	this.showCashDiv = true;
  // }

  confirmBooking() {
    //console.log(this.cardData[0].id); return false;
    this.spinnerService.show();
    //var body_obj = {stripe_token: stripe_token, booking_id: this.booking_id, amount: this.total_price, user_id: this.user_id, paid_medium: 1};
    var body_obj = { stripe_card_id: this.cardData[0].id, booking_id: this.booking_id, amount: this.total_price, user_id: this.user_id, paid_medium: 1, currency: this.currency };

    this.api_service.HttpPostReqHeader('website/confirmBooking', body_obj, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        this.saveBookingJobNo = response.data;
        ($('#successModal') as any).modal('show');
        //alert(response.message);
        // this.router.navigateByUrl(`/success/Y2FyZA`)
        // 	.then(() => {
        // 	window.location.reload();
        // });
        const currentObj = this;
        ($('body') as any).click(function (event) {
          currentObj.router.navigateByUrl(`/service-category`)
            .then(() => {
              window.location.reload();
            });
        });
      } else {
        //console.log(response.message);
        alert(response.message);
        this.spinnerService.hide();
      }
    })
  }

  // cashPayment() {
  // 	this.spinnerService.show();
  // 	var body_obj = { booking_id: this.booking_id, amount: this.total_price, user_id: this.user_id, paid_medium: 2, currency: this.currency};
  // 	//console.log(body_obj);
  // 	this.api_service.HttpPostReqHeader('website/confirmBooking',body_obj,true,this.logtoken).then((response:any)=>{
  // 		if(response.success == true){
  // 			this.spinnerService.hide();
  // 			//alert(response.message);
  // 			this.router.navigateByUrl(`/success/Y2FzaA`)
  // 				.then(() => {
  // 				window.location.reload();
  // 			});
  // 		} else if(response.success == false) {
  // 			//console.log(response.message);
  // 			alert(response.message);
  // 			this.spinnerService.hide();
  // 		}
  // 		else{
  // 			this.spinnerService.hide();
  // 		}
  // 	})
  // }

  getSavedCards() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSavedCards?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          console.log('c', response.data);
          if (response.type == 'tokenexpire') {
            this.router.navigateByUrl('/')
              .then(() => {
                localStorage.clear();
                window.location.reload();
              });
          }
          this.cardData = response.data;
          console.log('this.cardData', this.cardData);
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
        this.infoMessage = response.message;
        setTimeout(() => {
          this.infoMessage = "";
        }, 3000);
        this.getSavedCards();
      } else {
        this.spinnerService.hide();
        this.infoMessageRed = response.message;
        setTimeout(() => {
          this.infoMessageRed = "";
        }, 5000);
      }
    })
  }
  bookingContinue() {
    this.router.navigateByUrl(`/service-category`)
      .then(() => {
        window.location.reload();
      });
  }
}
