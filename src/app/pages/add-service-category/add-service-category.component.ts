import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-service-category',
  templateUrl: './add-service-category.component.html',
  styleUrls: ['./add-service-category.component.css']
})
export class AddServiceCategoryComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  allCategory: any;
  selectedCategoryId: any[] = [];
  selectedSubCategoryId: any[] = [];
  message: any;
  subCategoryData: any;
  serviceAddScreen = false;
  newNotification = false;
 // public translate: TranslateService;
  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private translateService: TranslateService) {
      // this.translateService.setDefaultLang('en');
      // this.translateService.use(localStorage.getItem('lang') || 'en');
    }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getAllCategory();
    this.getNewNotification();
  }
  getAllCategory() {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/getAllCategory/?token=${token}`, true)
      .then(
        (response: any) => {
          this.spinnerService.hide();
          //console.log('category list', response);
          this.allCategory = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  selectedCategory(event: any, category_id: any){
    if(event.currentTarget.checked){
      this.selectedCategoryId.push(category_id);
    }else{
      var index = this.selectedCategoryId.indexOf(category_id);
      if (index !== -1) {
        this.selectedCategoryId.splice(index, 1);
      }
    }
    //console.log(this.selectedCategoryId);
  }

  selectedSubCategory(event: any, sub_category_id: any){
    if(event.currentTarget.checked){
      this.selectedSubCategoryId.push(sub_category_id);
    }else{
      var index = this.selectedSubCategoryId.indexOf(sub_category_id);
      if (index !== -1) {
        this.selectedSubCategoryId.splice(index, 1);
      }
    }
   // console.log(this.selectedSubCategoryId);
  }

  addService(){
    if(this.selectedCategoryId.length > 0){
      this.serviceAddScreen = true;
      this.spinnerService.show();
      var body_obj = { cat_ids: this.selectedCategoryId };
      this.api_service.HttpPostReqHeader('website/getCategoryWiseSubcategory', body_obj, true, this.logtoken).then((response: any) => {
        //console.log("category wise subcategory responce ====> ", response);
        if (response.success == true) {
          this.subCategoryData = response.data;
          this.spinnerService.hide();
        } else {
          this.spinnerService.hide();
        }
      })
    }else{
      this.message = this.translateService.instant('Please choose at least one category');
      ($('#warningModal') as any).modal('show');
    }

  }

  saveService(){
    this.spinnerService.show();

    var body_obj = { cat_ids: this.selectedCategoryId };
    this.api_service.HttpPostReqHeader('website/saveCategory', body_obj, true, this.logtoken).then((response: any) => {
      //console.log("category save responce ====> ", response);
      if (response.success == true) {
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
      }
    })

    var body_obj1 = { sub_cat_ids: this.selectedSubCategoryId };
    this.api_service.HttpPostReqHeader('website/saveSubCategory', body_obj1, true, this.logtoken).then((response: any) => {
      //console.log("sub category save responce ====> ", response);
      if (response.success == true) {
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
      }
    })

    this.message = this.translateService.instant('Catgeory saved successfully');
      ($('#successModal') as any).modal('show');
      setTimeout(() => {
        this.router.navigateByUrl(`/service-list`).then(() => {
          window.location.reload();
        });
      }, 5000);
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
