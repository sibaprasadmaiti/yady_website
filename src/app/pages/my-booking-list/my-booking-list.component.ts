import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-booking-list',
  templateUrl: './my-booking-list.component.html',
  styleUrls: ['./my-booking-list.component.css']
})
export class MyBookingListComponent implements OnInit {

  logtoken = localStorage.getItem('LoginToken');
  booking_data: any = [];
  page = 1;
  srNewNotification = false;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private translateService: TranslateService) {
     }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }

    this.getdefaultaddress(this.logtoken);
  }

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.getMyBookingList(0);
        this.srGetNewNotification();
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

  getMyBookingList(booking_status: any) {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/myBookingList/?token=${token}&booking_status=${booking_status}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
         // console.log('ccccccccc', response.data);
          this.booking_data = response.data;
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

  viewDetails(booking_id: string) {
    console.log(booking_id);
    this.router.navigateByUrl(`/my-booking-details/${booking_id}`);
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

  srReadNotification(){
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
