import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	cardData;
	infoMessage = "";
	infoMessageRed = "";
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

	ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null) {
			this.router.navigateByUrl('/')
				.then(() => {
				localStorage.clear();
				window.location.reload();
			});
		}
    this.getdefaultaddress(this.logtoken);
		// this.getSavedCards();
    this.srGetNewNotification();
	}

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.getSavedCards();
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

	getSavedCards() {
		this.spinnerService.show();
		this.api_service.HttpGetReq(`website/getSavedCards?token=${this.logtoken}`, true)
        .then(
        (response: any) => {
          this.spinnerService.hide();
		  console.log('c',response.data);
			if(response.type == 'tokenexpire') {
				this.router.navigateByUrl('/')
					.then(() => {
					localStorage.clear();
					window.location.reload();
				});
			}
			this.cardData = response.data;
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
		this.api_service.HttpPostReqHeader('website/setDefaultCard',card_val,true,this.logtoken).then((response:any)=>{
			if(response.success == true){
				this.spinnerService.hide();
				this.infoMessage = response.message;
				setTimeout(()=>{
					this.infoMessage = "";
				}, 3000);
				this.getSavedCards();
			} else {
				 this.spinnerService.hide();
				 this.infoMessageRed = response.message;
				 setTimeout(()=>{
					this.infoMessageRed = "";
				}, 5000);
			}
		})
	}

	deleteCard(card_id) {
		//console.log(card_id);
		this.spinnerService.show();
		const card_val = {
			stripe_card_id: card_id,
		}
		this.api_service.HttpPostReqHeader('website/deleteCard',card_val,true,this.logtoken).then((response:any)=>{
			if(response.success == true){
				this.spinnerService.hide();
				this.infoMessage = response.message;
				setTimeout(()=>{
					this.infoMessage = "";
				}, 3000);
				this.getSavedCards();
			} else{
				 this.spinnerService.hide();
				 this.infoMessageRed = response.message;
				 setTimeout(()=>{
					this.infoMessageRed = "";
				}, 5000);
			}
		})
	}

  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          console.log('sr get new notification response => ', response);
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
