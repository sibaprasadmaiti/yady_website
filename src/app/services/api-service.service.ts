import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(public HttpClient: HttpClient, public loader: NgxSpinnerService, public toast: ToastrService) { }
  
  baseURL = 'https://nodeserver.mydevfactory.com:3377/';
  
  HttpGetReq(url, load) {
    return  new Promise(async (resolve, reject) => {
      if (load) {
        this.loader.show();
      }
      this.HttpClient.get(this.baseURL + url, {}).subscribe(async res => {
        if (load) {
          await this.loader.hide();
        }
        resolve(res);
      }, async (error) => {
        reject(error);
        if (load) {
          await this.loader.hide();
        }
      });
    });
  }
  HttpPostReq(url, data, load) {
    return  new Promise(async (resolve, reject) => {
      if (load) { this.loader.show(); }
      this.HttpClient.post(this.baseURL + url, data,   {  }).subscribe(async res => {
        if (load) { await this.loader.hide(); }
        resolve(res);
      }, async (error) => {
        reject(error);
        this.toast.success('Internal Server Error!!!');
        if (load) {     await this.loader.hide(); }
      });
    });
  }
  HttpPostReqHeader(url, data, load, token) {
	  //let headers = new Headers();
	  //headers.append('Content-Type','application/json');
	  //headers.append('token',token);
	  const headers = { 'token': token };
    return  new Promise(async (resolve, reject) => {
      if (load) { this.loader.show(); }
      this.HttpClient.post(this.baseURL + url, data, { headers } ).subscribe(async res => {
        if (load) { await this.loader.hide(); }
        resolve(res);
      }, async (error) => {
        reject(error);
        this.toast.success('Internal Server Error!!!');
        if (load) {     await this.loader.hide(); }
      });
    });
  }
  HttpDelReq(url, load) {
    console.log('url:::', url);
    return  new Promise(async (resolve, reject) => {
      if (load) {   this.loader.show(); }
      this.HttpClient.delete(this.baseURL + url, {}).subscribe(async res => {
        if (load) {   await this.loader.hide(); }
        resolve(res);
      }, async (error) => {
        reject(error);
        if (load) {   await this.loader.hide(); }
      });
    });
  }
  HttpPutReq(url, data, load) {
    return  new Promise(async (resolve, reject) => {
      if (load) { this.loader.show(); }
      this.HttpClient.put(this.baseURL + url, data,   {  }).subscribe(async res => {
        if (load) { await this.loader.hide(); }
        resolve(res);
      }, async (error) => {
        reject(error);
        this.toast.success('Internal Server Error!!!');
        if (load) {     await this.loader.hide(); }
      });
    });
  }
  HttpGetReq2(url, load) {
    return  new Promise(async (resolve, reject) => {
      if (load) {
        this.loader.show();
      }
      this.HttpClient.get( url, {}).subscribe(async res => {
        if (load) {
          await this.loader.hide();
        }
        resolve(res);
      }, async (error) => {
        reject(error);
        if (load) {
          await this.loader.hide();
        }
      });
    });
  }
}
