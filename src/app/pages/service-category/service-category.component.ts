import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.css']
})
export class ServiceCategoryComponent implements OnInit {
  queryServiceForm: FormGroup;
  category_name;
  categoryData;
  queryCategoryStatus: any;
  page = 1;
  logtoken = localStorage.getItem('LoginToken');
  login_status = 1;
  imageSrc: any;
  userData: any;
  addressData: any;
  queryImage: any[] = [];
  message="";

  constructor(public formbuilder: FormBuilder, private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.queryServiceForm = formbuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      mobile_no: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      service_type: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      query_image: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          this.login_status = 0;
          localStorage.clear();
          window.location.reload();
        });
    } else {
      this.getdefaultaddress(this.logtoken);

    }
  }

  getdefaultaddress(token: any) {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getdefaultaddress?token=${token}`, true).then((response: any) => {
      this.spinnerService.hide();
      //console.log('Default Address responce ====> ', response.data);
      if (response.success) {
        this.addressData = response.data;
        this.categoryListShow(this.category_name);
        this.getUserDetails();

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

  getUserDetails() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/userProfileDetails?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log("user profile details ===> ", response);

          if (response.success == true) {
            this.userData = response.data;
            this.queryServiceForm.patchValue({
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              mobile_no: response.data.only_mobile_no,
              address: this.addressData.house_no +' '+ this.addressData.street_address +' '+ this.addressData.land_mark +' '+ this.addressData.city +' '+ this.addressData.state,
            });
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();

        });
  }

  categoryListShow(category_name) {
    this.spinnerService.show();
    if (this.logtoken != '' && this.logtoken != null) {
      this.api_service.HttpGetReq(`website/getDefaultAddress?token=${this.logtoken}`, true)
        .then(
          (response: any) => {
            if (response.success == true) {
              this.getCategories(category_name, response.data.lattitude, response.data.longitude);
            } else {
              this.getCategories(category_name, 'none', 'none');
            }
          },
          (error) => {

          }
        );
    }
    else {
      this.getCategories(category_name, 'none', 'none');
    }
  }

  searchCategory(category_name: any) {
    //console.log(category_name);
    this.categoryListShow(category_name);
  }

  subCategoryList(cat_id: any) {
    this.router.navigateByUrl(`/service-sub-category/${cat_id}`);
  }

  getServicePrice(param, id, aq_status) {
    //console.log(param);
    //console.log(id);
    //console.log(aq_status);
    this.router.navigateByUrl(`/service-charges/${this.logtoken}/${param}/${id}/${aq_status}`)
      .then(() => {
        window.location.reload();
      });
  }

  getCategories(category_name, latitude, longitude) {
    this.api_service.HttpGetReq(`website/getCategories?category_name=${category_name}&latitude=${latitude}&longitude=${longitude}`, true)
      .then(
        (response: any) => {
          //console.log("get category response ==> ", response);

          this.categoryData = response.data;
          this.queryCategoryStatus = response.query_category_status;
          this.spinnerService.hide();
          //this.toastr.success(response.message);
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
  imgSrc() {
    this.imageSrc = [];
    this.queryServiceForm.patchValue({
      service_type: "",
      description: "",
    });
  }
  readURL(event: any) {
    this.imageSrc = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        this.queryImage.push(file);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }

  saveQueryService() {
    let formValue = this.queryServiceForm.value;
    formValue.service_requester_id = this.userData.user_id;
    formValue.sr_address_id = this.addressData._id;
    formValue.query_category_id = this.queryCategoryStatus.query_category_id;
    let form_data = new FormData();
    form_data.append('params', JSON.stringify(formValue));
    if (this.queryImage.length > 0)
      for (let file of this.queryImage) {
        { form_data.append('query_image', file); }
      }
    //console.log("form data => ", formValue);
    this.spinnerService.show();

    this.api_service.HttpPostReqHeader('website/saveQueryService', form_data, true, this.logtoken).then((response: any) => {
     // console.log("Query service save responce ==>  ", response);
      this.message = response.message;
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#querySubmitForm') as any).modal('hide');
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          this.message = "";
          ($('#successModal') as any).modal('hide');
        }, 5000);
      }
      else {
        this.spinnerService.hide();
        ($('#querySubmitForm') as any).modal('hide');
        ($('#warningModal') as any).modal('show');
        setTimeout(() => {
          this.message = "";
          ($('#warningModal') as any).modal('hide');
        }, 5000);
      }
    })

  }

}
