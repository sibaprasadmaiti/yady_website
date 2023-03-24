import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css']
})
export class BookingSummaryComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
  user_id = localStorage.getItem('userID');
	booking_id;
	booking_data:any;
  currency: any;
  walletpayStatus: any = 0;
  usedWalletMoney: any = 0;
  payableCost: any = 0;
  payAbleCashAmount: any = 0;
  saveBookingJobNo: any;
  paymentMethod: any;

  constructor(public formbuilder: FormBuilder,private route: ActivatedRoute, private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService, private translateService: TranslateService) { }

	ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null) {
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
	}

	getBookingSummary() {
		var token = this.logtoken;
		var booking_id = this.booking_id;
		this.spinnerService.show();

		this.api_service.HttpGetReq(`website/bookingSummary/?token=${token}&booking_id=${booking_id}`, true)
			.then(
				(response: any) => {
          //console.log('booking summary=>',response);
          if(response.success){
            this.spinnerService.hide();
            this.checkPaymentMethod();
            this.booking_data = response.data;
            this.currency = response.currency;
            this.walletpayStatus = response.data.wallet_pay_status;
            this.usedWalletMoney = response.data.used_wallet_money;
            if(response.data.wallet_pay_status == 1 && response.data.total_cost > response.data.used_wallet_money)
            this.payableCost = response.data.total_cost - response.data.used_wallet_money;
          }else{
            this.spinnerService.hide();
            this.router.navigateByUrl(`/payment/${this.booking_id}`)
              .then(() => {
              window.location.reload();
            });
          }
				  },
				  (error) => {
					this.spinnerService.hide();
				  /*this.toastr.error('Internal server error');
				  this.snackBar.open('Internal server error', 'End now', {
					duration: 5000,
				  });*/
			}
		);
	}

  checkPaymentMethod(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkPaymentMethod?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
     // console.log('Check payment responce ====> ', response.data);
      if (response.success) {
        this.paymentMethod = response.data;
      } else {
        alert(response.message);
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

	confirm_booking() {
    if(this.walletpayStatus == 1 && this.payableCost == 0){
      ($('#payFromCardCash') as any).modal('hide');
      ($('#payFromWallet') as any).modal('show');
    }else{
      ($('#payFromWallet') as any).modal('hide');
      ($('#payFromCardCash') as any).modal('show');
    }
	}

  cashPayment() {
    ($('#payFromCardCash') as any).modal('hide');
    ($('#payFromWallet') as any).modal('hide');
		this.spinnerService.show();
    if(this.walletpayStatus == 1 && this.payableCost > 0){
      this.payAbleCashAmount = this.payableCost;
    }
    if(this.walletpayStatus == 0){
      this.payAbleCashAmount = this.booking_data.total_cost;
    }
    if(this.walletpayStatus == 1 && this.payableCost == 0){
      this.payAbleCashAmount = 0;
    }

		var body_obj = { booking_id: this.booking_id, amount: this.payAbleCashAmount, user_id: this.user_id, paid_medium: 2, currency: this.currency};
		//console.log(body_obj);
		this.api_service.HttpPostReqHeader('website/confirmBooking',body_obj,true,this.logtoken).then((response:any)=>{
			if(response.success == true){
				this.spinnerService.hide();
        this.saveBookingJobNo = response.data;
        ($('#successModal') as any).modal('show');
				// this.router.navigateByUrl(`/success/Y2FzaA`)
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
				alert(response.message);
				this.spinnerService.hide();
			}
		})
	}

  bookingContinue(){
    this.router.navigateByUrl(`/service-category`)
					.then(() => {
					window.location.reload();
				});
  }

  cardPayment(){
    this.spinnerService.show();
		this.router.navigateByUrl(`/payment/${this.booking_id}`)
			.then(() => {
			window.location.reload();
		});
  }

}
