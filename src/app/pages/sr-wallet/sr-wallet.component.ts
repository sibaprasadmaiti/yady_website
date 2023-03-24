import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sr-wallet',
  templateUrl: './sr-wallet.component.html',
  styleUrls: ['./sr-wallet.component.css']
})
export class SrWalletComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  srNewNotification = false;
  addAmount: number;
  walletAmount: number = 0;
  walletData: any;
  errorMsg: any = "";
  cardData: any[] = [];
  userDefaultAddressId: any;
  message: any;
  paymentMethod: any;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) { }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    } else {
      this.getdefaultaddress();
    }
  }
  getdefaultaddress() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.userDefaultAddressId = response.data._id;
        ($('#warningModal') as any).modal('show');
        this.getSRWallet();
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

  getSRWallet() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSRWallet?token=${this.logtoken}`, true).then((response: any) => {
      //console.log('get wallet amount responce ====> ', response);
      if (response.success) {
        this.spinnerService.hide();
        this.checkPaymentMethod()
        this.walletData = response.data;
        this.walletAmount = response.data.total_money;
      } else {
        this.spinnerService.hide();
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  checkPaymentMethod(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkPaymentMethod?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
     console.log('Check payment responce ====> ', response.data);
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

  checkValue(event) {
    if (event.target.value < 1 || event.target.value == "") {
      event.target.value = "";
    } else {
      this.addAmount = event.target.value;
    }
  }
  addWalletAmount(amount: number) {
    if (this.addAmount == null) {
      this.addAmount = 0;
    }
    this.addAmount = this.addAmount + amount;
  }

  srGetNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/srGetNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('sr get new notification response => ', response);
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

  srReadNotification() {
    this.api_service.HttpPostReqHeader('website/srReadNotification', {}, true, this.logtoken).then((response: any) => {
      //  console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.srNewNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

  checkPayment() {
    this.router.navigateByUrl(`/sr-wallet-transaction`);
  }

  addMoney() {
    if (this.addAmount > 0) {
      this.errorMsg = "";
      ($('#cardPaymentModal') as any).modal('show');
    } else {
      this.errorMsg = "Please enter amount.";
    }
  }

  hideCardPaymentModal() {
    ($('#cardPaymentModal') as any).modal('hide');
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
          //console.log('cardData => ', this.cardData);
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

  topupPayment() {
    if (this.cardData.length > 0) {
      ($('#cardPaymentModal') as any).modal('hide');
      this.spinnerService.show();
      const postDataObj = {
        amount: this.addAmount,
        address_id: this.userDefaultAddressId,
        stripe_card_id: this.cardData[0].id,
      }
      this.api_service.HttpPostReqHeader('website/addMoneyToWallet', postDataObj, true, this.logtoken).then((response: any) => {
        if (response.success == true) {
          this.spinnerService.hide();
          this.message = response.message;
          ($('#successPaymentModal') as any).modal('show');
          this.addAmount = 0;
          this.getSRWallet();
          //Reload current page
          // ($('body') as any).click(function (event) {
          //   window.location.reload();
          // });
        } else {
          this.spinnerService.hide();
        }
      })
    } else {
      alert("Card data not found.");
      ($('#cardPaymentModal') as any).modal('hide');
    }
  }

}
