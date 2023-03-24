import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-uploaded-document-list',
  templateUrl: './uploaded-document-list.component.html',
  styleUrls: ['./uploaded-document-list.component.css']
})
export class UploadedDocumentListComponent implements OnInit {

	logtoken = localStorage.getItem('LoginToken');
	user_type = Number(localStorage.getItem('user_type'));
	documentsData;
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
				private router: Router,public api_service: ApiServiceService,
				private spinnerService: Ng4LoadingSpinnerService,
				public toastr: ToastrService) { }

    ngOnInit() {
		if(this.logtoken == '' || this.logtoken == null || this.user_type != 2) {
			this.router.navigateByUrl('/')
				.then(() => {
					localStorage.clear();
				window.location.reload();
			});
		}
		this.getSpDocuments();
    this.getNewNotification();
    }

	getSpDocuments() {
		this.spinnerService.show();
		this.api_service.HttpGetReq(`website/getSpDocuments?token=${this.logtoken}`, true)
        .then(
        (response: any) => {
          this.spinnerService.hide();
		  //console.log('c',response.data);
			if(response.type == 'tokenexpire') {
				this.router.navigateByUrl('/')
					.then(() => {
					localStorage.clear();
					window.location.reload();
				});
			}
			this.documentsData = response.data;
        },
			(error) => {
			  this.spinnerService.hide();
			}
        );
	}

	deleteImage(document_id) {
		this.spinnerService.show();
		if(document_id) {
			const documentObj = {
				document_id: document_id
			}
			this.api_service.HttpPostReqHeader('website/deleteDocument',documentObj,true,this.logtoken).then((response:any)=>{
				if(response.success == true){
					this.spinnerService.hide();
					this.getSpDocuments();
				} else{
					this.spinnerService.hide();
				}
			})
		}
	}

	addNewDocument() {
		this.router.navigateByUrl('/upload-documents').then(() =>{
			window.location.reload();
		})
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
