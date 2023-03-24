import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-service-sub-category',
  templateUrl: './service-sub-category.component.html',
  styleUrls: ['./service-sub-category.component.css']
})
export class ServiceSubCategoryComponent implements OnInit {
	
	sub_category_name;
	subCategoryData;
	cat_id;
	page = 1;
	logtoken = localStorage.getItem('LoginToken');
	login_status = 1;

  constructor(private route: ActivatedRoute, private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

	ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null) {
			this.login_status = 0;
			localStorage.clear();
		}
		this.subCategoryListShow(this.sub_category_name);
	}
  
	subCategoryListShow(sub_category_name: any) {
		this.spinnerService.show();
		if(this.logtoken != '' && this.logtoken != null)
		{
			this.api_service.HttpGetReq(`website/getDefaultAddress?token=${this.logtoken}`, true)
			.then(
				(response: any) => {
					if(response.success == true) {
						this.getSubCategories(sub_category_name, response.data.lattitude, response.data.longitude);
					} else {
						this.getSubCategories(sub_category_name, 'none', 'none');
					}
				},
				(error) => {
				
				}
			);
		}
		else
		{
			this.getSubCategories(sub_category_name, 'none', 'none');
		}
	}
	
	searchSubCategory(sub_category_name: any) {
		//console.log(sub_category_name);
		this.subCategoryListShow(sub_category_name);
	}
	getServicePrice(param,id,aq_status) {
		//console.log(param);
		//console.log(id);
		//console.log(aq_status);
		this.router.navigateByUrl(`/service-charges/${this.logtoken}/${param}/${id}/${aq_status}`)
		.then(() => {
			window.location.reload();
		});
	}
	
	getSubCategories(sub_category_name, latitude, longitude)
	{
		this.route.params.subscribe(params => {
			this.cat_id = params.cat_id;
		});
		this.api_service.HttpGetReq(`website/subCategoryList/${this.cat_id}/?sub_category_name=${sub_category_name}&latitude=${latitude}&longitude=${longitude}`, true)
		.then(
			(response: any) => {
				   this.subCategoryData = response.data;
				   this.spinnerService.hide();
			  },
			  (error) => {
					this.spinnerService.hide();
			}
		);
	}

}
