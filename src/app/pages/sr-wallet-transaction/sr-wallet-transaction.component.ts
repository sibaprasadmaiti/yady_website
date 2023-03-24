import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-sr-wallet-transaction',
  templateUrl: './sr-wallet-transaction.component.html',
  styleUrls: ['./sr-wallet-transaction.component.css']
})
export class SrWalletTransactionComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  myTransactionData: any[] = [];
  page = 1;
  perPage: any = 10;
  totalRecords: any = 0;

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
    }else{
      this.querySrTransactionDetails();
    }
  }

  querySrTransactionDetails() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/transactionList?token=${this.logtoken}&page=${this.page}&perPage=${this.perPage}`, true)
      .then(
        (response: any) => {
          //console.log('SR Transaction response => ', response);
          if (response.success) {
            this.spinnerService.hide();
            this.myTransactionData = response.data;
            this.totalRecords = response.totalData;
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
          console.log("error => ", error);
        });
  }

  nextPage(page: any) {
    this.page = page;
    this.querySrTransactionDetails();
  }

}
