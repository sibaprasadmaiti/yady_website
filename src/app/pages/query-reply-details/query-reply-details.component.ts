import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import * as moment from 'moment';


@Component({
  selector: 'app-query-reply-details',
  templateUrl: './query-reply-details.component.html',
  styleUrls: ['./query-reply-details.component.css']
})
export class QueryReplyDetailsComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  queryServiceAssignId: any;
  srNewNotification = false;
  queryReplyData: any;
  amountShow = false;
  message = "";
  choosenDate: any;
  addressData: any;
  queryBookingId: any;
  cardData: any;
  paidmedium: any;
  saveBookingJobNo: any;
  walletAmount: number = 0;
  walletData: any;
  walletpayStatus: any = 0;
  usedWalletMoney: any = 0;
  payableCost: any = 0;
  payAbleCashAmount: any = 0;
  taxAmount: any = 0;
  beforeTaxCost: any = 0;
  afterTaxCost: any = 0;
  view_count: any[] = [];
  current_view: any = 0;
  docLength: any = 0;
  paymentMethod;

  constructor(public formbuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, public api_service: ApiServiceService,
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
    this.route.params.subscribe(params => {
      this.queryServiceAssignId = params.query_service_assign_id;
      this.getdefaultaddress();
    });
  }
  queryReplyDetails() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/queryReplyDetails?token=${this.logtoken}&query_service_assign_id=${this.queryServiceAssignId}`, true)
      .then(
        (response: any) => {
          console.log('query reply details response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.queryReplyData = response.data;
            this.docLength = response.data.query_submitted_doc.length;
            this.beforeTaxCost = response.data.cost;
            this.checkPaymentMethod();
            if (response.data.tax > 0) {
              this.taxAmount = (response.data.tax / 100) * response.data.cost;
            }
            this.afterTaxCost = this.beforeTaxCost + this.taxAmount;

            const thisvar = this;
            if (response.data.booked_status == 0 && response.data.doc_download_status == 1) {
              var date = new Date();
              // var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              var upcommingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 31);
              (($("#queryBookingCalendar") as any).datepicker({
                //todayHighlight: true,
                weekStart: 1,
                //minDate:new Date()
                startDate: date,
                endDate: upcommingDate,
              }) as any).on({
                'changeDate': function (e) {
                  if (typeof (e.date) == "undefined")
                    return false;
                  var selectedDate = moment(e.date).format('YYYY-MM-DD');
                  thisvar.choosenDate = selectedDate;
                  thisvar.chkHoliday(selectedDate);
                  //console.log("choosen date => ", selectedDate);
                }
              });
            }
          } else {
            this.spinnerService.hide();
            this.queryReplyData = {};
          }
        },
        (error) => {
          this.spinnerService.hide();
        });
  }
  chkHoliday(date: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkHoliday?token=${this.logtoken}&booking_date=${date}&latitude=${this.addressData.lattitude}&longitude=${this.addressData.longitude}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('check holiday responce ====> ', response.data);
      if (response.success) {
        this.message = response.message;
        ($('#paymentAlertModal') as any).modal('hide');
        ($('#cardPaymentModal') as any).modal('hide');
        ($('#warningModal') as any).modal('show');
      } else {
        this.amountShow = true;
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  downloadFile(pdfPath: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/downloadDocument?token=${this.logtoken}&query_assign_id=${this.queryReplyData.query_assign_id}`, true).then((response: any) => {
      this.spinnerService.hide();
      this.downloadAll(pdfPath);
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  downloadAll(pdfPath) {
    var link = document.createElement('a');
    link.setAttribute('download', pdfPath.query_assign_doc.substr(pdfPath.query_assign_doc.lastIndexOf('/') + 1));
    link.style.display = 'none';
    document.body.appendChild(link);
    link.setAttribute('target', '_blank');
    link.setAttribute('href', pdfPath.query_assign_doc);
    link.click();
    document.body.removeChild(link);

    this.queryReplyDetails();
  }

  chkQueryBookingExists(date: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkQueryBookingExists?token=${this.logtoken}&date=${date}&days=${this.queryReplyData.days}&service_provider_id=${this.queryReplyData.service_provider_id}&latitude=${this.addressData.lattitude}&longitude=${this.addressData.longitude}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('check query booking exists responce ====> ', response.data);
      if (response.success) {
        this.amountShow = true;
      } else {
        this.message = response.message;
        ($('#paymentAlertModal') as any).modal('hide');
        ($('#cardPaymentModal') as any).modal('hide');
        ($('#warningModal') as any).modal('show');
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  getdefaultaddress() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.queryReplyDetails();

        this.addressData = response.data;
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

  checkPaymentMethod(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkPaymentMethod?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
     // console.log('Check payment responce ====> ', response.data);
      if (response.success) {
        this.paymentMethod = response.data;
        if(response.data.wallet_status == 1){
          this.getSRWallet();
        }
      } else {
        alert(response.message);
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

  useWalletBalance(event) {
    if (event.currentTarget.checked) {
      this.walletpayStatus = 1;
    } else {
      this.walletpayStatus = 0;
      this.usedWalletMoney = 0;
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

  paymentAlert() {
    if (this.walletpayStatus == 1) {
      if (this.walletAmount <= this.afterTaxCost) {
        this.usedWalletMoney = this.walletAmount;
      } else {
        this.usedWalletMoney = this.afterTaxCost;
      }
    }
    if (this.walletpayStatus == 1 && this.afterTaxCost > this.walletAmount) {
      this.payableCost = this.afterTaxCost - this.walletAmount;
    }

    if (this.walletpayStatus == 1 && this.payableCost > 0) {
      this.payAbleCashAmount = this.payableCost;
    }
    if (this.walletpayStatus == 0) {
      this.payAbleCashAmount = this.queryReplyData.cost;
    }
    if (this.walletpayStatus == 1 && this.payableCost == 0) {
      this.payAbleCashAmount = 0;
    }


    // this.message = "Are you sure want to proceed for payment?";
    // ($('#paymentAlertModal') as any).modal('show');
    this.submitQueryBooking();
  }

  cardPaymentShow(paidMedium: any) {
    if (paidMedium == 1) {
      this.getSavedCards();
      // ($('#paymentAlertModal') as any).modal('hide');
      ($('#payFromCardCash') as any).modal('hide');
      ($('#cardPaymentModal') as any).modal('show');
      this.paidmedium = 1;
    } else {
      this.paidmedium = 2;
      ($('#payFromCardCash') as any).modal('hide');
      this.confirmQueryBooking();
    }
  }

  hideCardPaymentModal() {
    ($('#cardPaymentModal') as any).modal('hide');
  }

  submitQueryBooking() {
    this.spinnerService.show();
    const query = {
      booking_date: this.choosenDate,
      address_id: this.addressData._id,
      service_requester_id: this.addressData.user_id,
      service_provider_id: this.queryReplyData.service_provider_id,
      cost: this.queryReplyData.cost,
      currency: this.queryReplyData.currency,
      query_service_id: this.queryReplyData.query_service_id,
      query_service_assign_id: this.queryReplyData.query_service_assign_id,
      query_category_id: this.queryReplyData.query_category_id,
      wallet_pay_status: this.walletpayStatus,
      used_wallet_money: this.usedWalletMoney,
      tax: this.taxAmount,
      before_tax_cost: this.beforeTaxCost,
    }
     console.log("query data => ", query);

    this.api_service.HttpPostReqHeader('website/submitQueryBooking', query, true, this.logtoken).then((response: any) => {
      //console.log("submit query booking responce  => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.queryBookingId = response.data;

        if (this.walletpayStatus == 1 && this.payableCost == 0) {
          ($('#payFromCardCash') as any).modal('hide');
          ($('#payFromWallet') as any).modal('show');
        } else {
          ($('#payFromWallet') as any).modal('hide');
          ($('#payFromCardCash') as any).modal('show');
        }

      } else {
        this.spinnerService.hide();
      }
    })
  }

  confirmQueryBooking() {
    ($('#cardPaymentModal') as any).modal('hide');
    ($('#payFromWallet') as any).modal('hide');
    this.spinnerService.show();
    const query = {
      query_booking_id: this.queryBookingId,
      paid_medium: this.paidmedium,
      stripe_card_id: this.cardData ? this.cardData[0].id : "",
      user_id: this.addressData.user_id,
      cost: this.payAbleCashAmount,
      currency: this.queryReplyData.currency,
      wallet_pay_status: this.walletpayStatus,
    }
    //console.log("confirm booking data => ", query);

    this.api_service.HttpPostReqHeader('website/confirmQueryBooking', query, true, this.logtoken).then((response: any) => {
      //console.log("Confirm query booking responce  => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = response.message;
        this.saveBookingJobNo = response.data;
        // ($('#successPaymentModal') as any).modal('show');
        ($('#successModal') as any).modal('show');
        // setTimeout(() => {
        //   this.router.navigateByUrl(`/my-query-list`).then(() => {
        //     window.location.reload();
        //   })
        // }, 5000);
        const currentObj = this;
        ($('body') as any).click(function (event) {
          currentObj.router.navigateByUrl(`/my-query-list`)
            .then(() => {
              window.location.reload();
            });
        });
      } else {
        this.spinnerService.hide();
        ($('#payFromCardCash') as any).modal('hide');
        ($('#payFromWallet') as any).modal('hide');
        alert(response.message);
      }
    })
  }

  bookingContinue() {
    this.router.navigateByUrl(`/my-query-list`)
      .then(() => {
        window.location.reload();
      });
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

  srReadNotification() {
    this.api_service.HttpPostReqHeader('website/srReadNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ",response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.srNewNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
