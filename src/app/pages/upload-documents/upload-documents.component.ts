import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent implements OnInit {

  docForm: FormGroup;
  logtoken = localStorage.getItem('LoginToken');
  user_type = Number(localStorage.getItem('user_type'));
  images = [];
  images_type = [];
  file_name = [];
  myFiles: string[] = [];
  filetag: string[] = [];
  alertMsg;
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.docForm = formbuilder.group({
      file: ['', Validators.compose([Validators.required])],
      fileSource: ['', Validators.compose([Validators.required])],
      tag: ['', Validators.compose([Validators.required])]
    });


  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.user_type != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getNewNotification();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          //console.log(event.target.result);
          var xyz = event.target.result;
          const type = xyz.split(';')[0].split('/')[1];
          //console.log(type);
          this.images.push(event.target.result);
          this.images_type.push(type);

          this.docForm.patchValue({
            fileSource: this.images
          });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }

    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
    console.log(this.myFiles);
  }

  removeImage(i) {
    this.images.splice(i, 1);
  }

  saveDocuments() {
    const form_data = new FormData();
    if (this.myFiles.length > 0) {
      for (var i = 0; i < this.myFiles.length; i++) {
        form_data.append("sp_document", this.myFiles[i]);
      }
      for (var i = 0; i < this.myFiles.length; i++) {
        //console.log((<HTMLInputElement>document.getElementById('tag'+[i])).value);
        var f_tag = (<HTMLInputElement>document.getElementById('tag' + [i])).value;
        if (f_tag.trim() == '') {
          alert('Please add tag to all the files');
          return false;
        } else {
          form_data.append("tag", (<HTMLInputElement>document.getElementById('tag' + [i])).value);
        }
      }
    } else {
      alert('Please add a document first');
      return false;
    }
    //console.log(form_data); return false;
    //console.log(form_data);
    //var sxa = (<HTMLInputElement>document.getElementById('tag0')).value;
    //console.log(sxa);

    this.spinnerService.show();
    this.api_service.HttpPostReqHeader('website/uploadSpDocuments', form_data, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        //this.infoMessage = response.message;
        //console.log(response.data);
        this.router.navigateByUrl(`/document-list`)
          .then(() => {
            window.location.reload();
          });
      }
      else {
        this.spinnerService.hide();
        this.alertMsg = response.message;
      }
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

  readNotification() {
    this.api_service.HttpPostReqHeader('website/readNotification', {}, true, this.logtoken).then((response: any) => {
      //console.log("Notification read  => ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.newNotification = false;
      } else {
        this.spinnerService.hide();
      }
    })
  }

}
