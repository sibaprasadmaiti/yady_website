import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {

	type;
	info_msg = "";

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.type = params.type;
		});
		if(this.type == 'Y2FyZA')
		{
			this.info_msg = "card"
		}
		if(this.type == 'Y2FzaA')
		{
			this.info_msg = "cash"
		}
    setTimeout(() => {
      this.router.navigateByUrl(`/service-category`).then(() => {
        window.location.reload();
      })
    }, 4000);
	}

}
