import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  allCategory: any;
  myServiceList: any;
  myServiceListSubCat: any;
  deleteCatId: any;
  deleteSubCatId: any;
  message: any;
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) { }

  ngOnInit() {
    if ((this.logtoken == '' || this.logtoken == null) && this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }else{
      this.getNewNotification();
      this.myServices();
    }

  }

  getAllCategory() {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/getAllCategory/?token=${token}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
         // console.log('category list', response);
          this.allCategory = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  myServices() {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/myServices/?token=${token}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          console.log('my service list', response);
          this.myServiceList = response.category;
          this.myServiceListSubCat = response.subcategory;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  deteteCat(category_id: any, category_name: any){
    this.deleteCatId = category_id;
    this.message = "Are you sure want to delete this category "+ category_name +"?";
    ($('#warningModal') as any).modal('show');
  }

  deteteSubcat(category_id: any, sub_category_name: any){
    this.deleteSubCatId = category_id;
    this.message = "Are you sure want to delete this category "+ sub_category_name +"?";
    ($('#warningModal') as any).modal('show');
  }

  deleteCategory(){
    this.spinnerService.show();
    var body_obj = { category_id: this.deleteCatId, sub_category_id: this.deleteSubCatId };
    this.api_service.HttpPostReqHeader('website/deleteSavedCategory', body_obj, true, this.logtoken).then((response: any) => {
     // console.log("category delete responce ====> ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#warningModal') as any).modal('hide');
        this.message = "Category deleted successfully.";
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        this.spinnerService.hide();
      }
    })
  }

  addService(){
    this.router.navigateByUrl(`/add-service-category`);
  }

  getNewNotification() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getNewNotification?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('get new notification response => ', response);
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
