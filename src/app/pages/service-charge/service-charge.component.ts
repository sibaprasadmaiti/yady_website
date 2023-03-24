import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-service-charge',
  templateUrl: './service-charge.component.html',
  styleUrls: ['./service-charge.component.css']
})
export class ServiceChargeComponent implements OnInit {
  servicePriceForm: FormGroup;
  addressForm: FormGroup;
  param;
  id;
  aq_status;
  aq_status_res;
  logtoken = localStorage.getItem('LoginToken');
  cat_sub_details: any = [];
  servicePricesData;
  servicePriceHours;
  price_structure_question;
  hour;
  price;
  option;
  service_name;
  cost;
  inspection_cost;
  tax: any = 0;
  add_ons;
  total_before_tax;
  total;
  order_total;
  discounted_amount;
  aq_id_array: any = [];
  aq_id: any = [];
  aq_ans_array: any = [];
  body_obj;
  promo_code_obj;
  save_booking_obj;
  public promo_code_text: boolean = false;
  public promo_code_tick: boolean = false;
  public promo_code_cross: boolean = true;
  infoMessage = "";
  alertMsg = "";
  promo_code;
  time_array_data: any = [];
  booking_date;
  booking_time;
  promo_code_id: any = "";
  myFiles: string[] = [];
  addressData;
  alladdressData;
  timeSlotArray: any = [];
  selectedTime: any;
  bookingDate: any;
  showSlot = false;
  public lat;
  public lng;
  public currentLocationCountry;
  walletAmount: number = 0;
  walletData: any;
  walletpayStatus: any = 0;
  usedWalletMoney: any = 0;
  paymentMethod;

  constructor(public formbuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

    this.servicePriceForm = formbuilder.group({
      address: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.required])],
      file: [''],
    });

    this.addressForm = formbuilder.group({
      street_address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zip_code: ['', Validators.compose([Validators.required])],
      lattitude: [''],
      longitude: [''],
      address_type: ['', Validators.compose([Validators.required])],
      house_no: [''],
      land_mark: ['']
    });
  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    localStorage.removeItem("hour");
    localStorage.removeItem("price");
    localStorage.removeItem("aq_id");
    localStorage.removeItem("option");
    this.route.params.subscribe(params => {
      this.param = params.param;
    });
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    this.route.params.subscribe(params => {
      this.aq_status = params.aq_status;
    });

    this.getTimeTable();
    this.getDefaultAddress();
    this.getUserAddresses();

    //Current location country name
    if (navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        let geocoder = new google.maps.Geocoder;
        let latlng = {
          lat: this.lat,
          lng: this.lng
        };
        let currentObj = this;
        geocoder.geocode({
          'location': latlng
        }, function (results) {
          if (results[0]) {
            for (var i = 0; i < results[0].address_components.length; i++) {
              if (results[0].address_components[i].types[0] == "country") {
                currentObj.currentLocationCountry = results[0].address_components[i].long_name;
              }
            }
          } else {
            console.log('Not found');
          }
        });
      });
    }
  }

  getServicePrices(token, param, id, aq_status) {
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/getSerivcePrices/?token=${token}&param=${param}&id=${id}&aq_status=${aq_status}&latitude=${this.addressData.lattitude}&longitude=${this.addressData.longitude}`, true)
      .then(
        (response: any) => {
         // console.log("Responce........", response);
          this.checkPaymentMethod();
          this.servicePricesData = response.Data;
          this.cat_sub_details = response.cat_sub_data;
          //console.log('this.cat_sub_details',this.cat_sub_details);
          this.servicePriceHours = response.hourly_prices.price_structure;
          this.aq_status_res = response.aq_status;
          this.price_structure_question = response.hourly_prices.price_structure_question;
          this.spinnerService.hide();

          var date = new Date();
          var nextDays = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);
          const currentObj = this;
          (($("#bokkingCalendar") as any).datepicker({
            // todayHighlight: true,
            weekStart: 1,
            //minDate:new Date()
            startDate: date,
            endDate: nextDays,
          }) as any).on({
            'changeDate': function (e) {
              if (typeof (e.date) == "undefined")
                return false;
              currentObj.showSlot = true;
              var selectedDate = moment(e.date).format('YYYY-MM-DD');
              currentObj.booking_date = selectedDate;
              // currentObj.bookingDate = selectedDate;
              // console.log("fkjfhg", selectedDate);

              var todayDate = moment(date).format('YYYY-MM-DD');
              var currentTime = moment(date).format('HH:mm');
              if (selectedDate == todayDate) {
                if (currentTime < response.cat_sub_data.service_start_time)
                  currentObj.selectedTime = moment(selectedDate + ' ' + response.cat_sub_data.service_start_time, 'YYYY-MM-DD HH:mm').add(response.cat_sub_data.booking_time_gap, 'hours').format('HH:mm');
                else
                  currentObj.selectedTime = moment(selectedDate + ' ' + currentTime, 'YYYY-MM-DD HH:mm').add(response.cat_sub_data.booking_time_gap, 'hours').format('HH:mm');
              } else {
                currentObj.selectedTime = moment(selectedDate + ' ' + response.cat_sub_data.service_start_time, 'YYYY-MM-DD HH:mm').format('HH:mm');
              }

              //Start time ceil
              var date = new Date(selectedDate + ' ' + currentObj.selectedTime);  //or use any other date
              let hr = date.getHours();
              var start_time = moment(hr + ':00', 'HH:mm').format('HH:mm');
              if (date.getMinutes() > 30) {
                start_time = moment(hr + ':00', 'HH:mm').add(1, 'hours').format('HH:mm');
              }

              //End time round
              var enddate = new Date(selectedDate + ' ' + response.cat_sub_data.service_end_time);  //or use any other date
              let enhr = enddate.getHours();
              var end_time = moment(enhr + ':00', 'HH:mm').format('HH:mm');
              if (enddate.getMinutes() > 30) {
                end_time = moment(enhr + ':00', 'HH:mm').add(1, 'hours').format('HH:mm');
              }


              if (start_time > end_time || start_time == '00:00') {
                end_time = "00:00";
              }
              // console.log(start_time);
              // console.log(end_time);
              //Parse Time & Interval
              var start_time1 = currentObj.parseTime(start_time);
              var end_time1 = currentObj.parseTime(end_time);
              var interval1 = response.cat_sub_data.time_interval;
              currentObj.calculate_time_slot(selectedDate, start_time1, end_time1, interval1);
            }
          });
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  checkPaymentMethod(){
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/chkPaymentMethod?token=${this.logtoken}`, true).then((response: any) => {
      this.spinnerService.hide();
     // console.log('Check payment responce ====> ', response.data);
      if (response.success) {
        this.paymentMethod = response.data;
        if(response.data.wallet_status == 1){
          this.getSRWallet();
        }
      } else {
        alert(response.message);
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  getSRWallet() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSRWallet?token=${this.logtoken}`, true).then((response: any) => {
      //console.log('get wallet amount responce ====> ', response);
      if (response.success) {
        this.spinnerService.hide();
        this.walletData = response.data;
        this.walletAmount = response.data.total_money;
      } else {
        this.spinnerService.hide();
      }
    },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  getCalculatedPrices() {
    this.spinnerService.show();
    var hour = localStorage.getItem('hour');
    var price = localStorage.getItem('price');
    var option = localStorage.getItem('option');
    //console.log('cccccc', option);
    var aq_id_data = JSON.parse(localStorage.getItem("aq_id"));

    if (aq_id_data != null) {
      var body_obj = { hour: hour, price: price, param: this.param, id: this.id, aq_status: this.aq_status, aq_id: aq_id_data, option: option };
    } else {
      var body_obj = { hour: hour, price: price, param: this.param, id: this.id, aq_status: this.aq_status, aq_id: aq_id_data, option: option };
    }

    //console.log(hour);
    //console.log(price);
    //console.log(this.param);
    //console.log(this.id);
    //console.log(this.aq_status);
    //console.log(aq_id_data);
    //console.log(body_obj);

    //return false;

    this.api_service.HttpPostReqHeader('website/getCalculatedPrices', body_obj, true, this.logtoken).then((response: any) => {
     // console.log("get calculate price response => ", response.data);
      if (response.success == true) {
        this.spinnerService.hide();
        //this.infoMessage = response.message;

        this.service_name = response.data.name;
        this.cost = response.data.cost;
        this.inspection_cost = response.data.inspection_cost;
        this.add_ons = response.data.add_ons;
        this.total_before_tax = parseInt(response.data.cost) + parseInt(response.data.add_ons) + parseInt(response.data.inspection_cost);
        if (response.data.tax > 0) {
          // const taxValue = (response.data.tax / 100) * this.total_before_tax;

          //For float number
          //if(Number(taxValue) === taxValue && taxValue % 1 !== 0){
          // this.tax = ((response.data.tax / 100) * this.total_before_tax).toFixed(1);
          //}
          //For Integer number
          //if(Number(taxValue) === taxValue && taxValue % 1 === 0){
          this.tax = (response.data.tax / 100) * this.total_before_tax;
          //}

        }
        this.total = parseInt(response.data.cost) + parseInt(response.data.add_ons) + parseInt(response.data.inspection_cost) + this.tax;
        this.order_total = Math.round(parseInt(response.data.cost) + parseInt(response.data.add_ons) + parseInt(response.data.inspection_cost) + this.tax);
      }
      else {
        this.spinnerService.hide();
        //this.infoMessage = response.message;
      }
    })
  }

  getTimeTable() {
    this.api_service.HttpGetReq(`website/getTimeTable/?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('ccccccccc',response);
          this.time_array_data = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }


  getHoursPrice(e) {
    //console.log(e.hour);
    localStorage.removeItem("hour");
    localStorage.removeItem("price");

    localStorage.setItem('hour', e.hour);
    localStorage.setItem('price', e.price);
    this.getCalculatedPrices();
  }

  getAddOnPrice(event, service_prices_addons) {
    //console.log(service_prices_addons);
    //console.log(event.target.checked);
    if (localStorage.getItem('hour') == null) {
      event.target.checked = false;
      alert('Please first select how many hours you want to book?');
      return false;
    }
    if (event.target.checked == true) {
      this.aq_id_array.push(service_prices_addons._id);
    }
    else {
      var index = this.aq_id_array.indexOf(service_prices_addons._id);
      if (index > -1) {
        this.aq_id_array.splice(index, 1);
      }
    }
    //console.log("add  on => ", this.aq_id_array);
    var aq_id = [];
    localStorage.setItem("aq_id", JSON.stringify(this.aq_id_array));
    //var xxxxxxx = JSON.parse(localStorage.getItem("aq_id"));
    //console.log(xxxxxxx);
    this.getCalculatedPrices();
  }

  getQustionPrice(sp_ans, sp_ques) {
    // console.log('sp_ans', sp_ans);
    // console.log('sp_ques', sp_ques);
    //console.log('your',localStorage.getItem('hour'));

    /*if(sp_ques.question_type == 1) {
      console.log('q_type 1');
    } else if(sp_ques.question_type == 2 && sp_ans.option.toLowerCase() == 'yes') {
      console.log('q_type 2,yes');
    } else if(sp_ques.question_type == 2 && sp_ans.option.toLowerCase() == 'no') {
      console.log('q_type 2,no');
    } else if(sp_ques.question_type == 2 && (sp_ans.option.toLowerCase() != 'yes' || sp_ans.option.toLowerCase() == 'no')) {
      console.log('q_type 2,bothno');
    }*/

    if (localStorage.getItem('hour') == null) {
      alert('Please first select how many hours you want to book?');
      return false;
    }

    if (sp_ques.question_type == 1) {
      localStorage.removeItem("option");

      if (this.aq_id_array.length > 0) {
        const index_zz = this.aq_id_array.indexOf(sp_ques._id);
        if (index_zz > -1) {
          this.aq_ans_array.splice(index_zz, 1);
        }
      }
      this.aq_id_array.push(sp_ques._id);
      this.aq_ans_array.push(sp_ans.option);

      localStorage.setItem('option', sp_ans.option);
      //console.log('aaaaaaop',localStorage.getItem('option'));
    } else if (sp_ques.question_type == 2 && sp_ans.option.toLowerCase() == 'yes') {
      this.aq_id_array.push(sp_ques._id);
      this.aq_ans_array.push(sp_ans.option);
    } else if (sp_ques.question_type == 2 && sp_ans.option.toLowerCase() == 'no') {
      var index = this.aq_id_array.indexOf(sp_ques._id);
      if (index > -1) {
        this.aq_id_array.splice(index, 1);
      }
      var index_2 = (this.aq_ans_array.indexOf('Yes'));
      if (index_2 > -1) {
        this.aq_ans_array.splice(index_2, 1);
      }
    } else {
      this.aq_id_array.push(sp_ques._id);
      this.aq_ans_array.push(sp_ans.option);
      localStorage.setItem('option', sp_ans.option);
    }
    //console.log('aaa',this.aq_id_array);
    const unique = [...new Set(this.aq_id_array)];
    console.log('bbb', unique);
    const unique_2 = [...new Set(this.aq_ans_array)];
    console.log('bbb2', unique_2);
    var aq_id = [];
    var aq_ans = [];
    localStorage.setItem("aq_id", JSON.stringify(unique));
    localStorage.setItem("aq_ans", JSON.stringify(unique_2));
    //console.log('aq_id rahul',JSON.parse(localStorage.getItem("aq_id")));
    //console.log('aq_id rahul2',JSON.parse(localStorage.getItem("option")));
    this.getCalculatedPrices();
  }

  apply_promo_code(total, promo_code) {
    if (total != '' && promo_code != '' && total != undefined && promo_code != undefined) {
      this.spinnerService.show();
      var promo_code_obj = { promo_code: promo_code, total_cost: total, user_id: this.addressData.user_id, param: this.param, id: this.cat_sub_details.cs_id, latitude: this.addressData.lattitude, longitude: this.addressData.longitude };
      this.api_service.HttpPostReqHeader('website/promoCodeApply', promo_code_obj, true, this.logtoken).then((response: any) => {
        if (response.success == true) {
          this.spinnerService.hide();
          //this.infoMessage = response.message;
         // console.log(response.data);
          this.order_total = Math.round(response.data.discounted_amount);
          this.discounted_amount = parseInt(total) - parseInt(response.data.discounted_amount);
          this.promo_code_id = response.data.promo_code_id;
          this.promo_code_text = true;
          this.promo_code_tick = true;
          this.promo_code_cross = false;
          this.infoMessage = "";
        } else if (response.success == false) {
          this.spinnerService.hide();
          this.promo_code_cross = false;
          this.infoMessage = response.message;
        }
        else {
          this.spinnerService.hide();
          this.promo_code_cross = false;
          this.infoMessage = response.message;
        }
      })
    }
  }

  remove_promo_code() {
    this.promo_code_text = false;
    this.promo_code_tick = false;
    this.promo_code_cross = true;
    this.discounted_amount = "";
    this.order_total = this.total;
    this.promo_code = "";
    this.infoMessage = "";
  }

  getTime(e, time_array) {
    var oldActive = document.getElementsByClassName("current");
    for (var i = 0; i < oldActive.length; i++) {
      oldActive[i].classList.remove("current");
    }
    $(e.target).addClass('current');
    this.booking_time = time_array;
    console.log(this.booking_time);
  }

  onFileChange(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
    console.log(this.myFiles);
  }

  save_booking() {
    //console.log('aaa',this.addressData._id); return false; //asche ekhane address id
    if (this.addressData.country == this.currentLocationCountry) {
      const form_data = new FormData();
      var aq_status = this.aq_status;
      if (aq_status == 2) {
        var option = localStorage.getItem('option');
        var servic_instruction = (<HTMLInputElement>document.getElementById('instruction')).value;
      } else {
        var option = '0';
        var servic_instruction = "";
      }
      if (localStorage.getItem('hour') == null) {
        this.alertMsg = 'Please Select How Many Hours You Want To Book';
        return false;
      }
      if (localStorage.getItem('price') == null) {
        this.alertMsg = 'Please Select a Price';
        return false;
      }
      var booking_date = (<HTMLInputElement>document.getElementById('booking_date')).value;
      if (booking_date == null || booking_date == "") {
        this.alertMsg = 'Select Booking Date';
        return false;
      }
      if (this.timeSlotArray.length == 0) {
        this.alertMsg = 'Selected Date Time is not Available. Please Choose Another Date';
        return false;
      }
      if (this.booking_time == undefined || this.booking_time == "") {
        this.alertMsg = 'Select Booking Time';
        return false;
      }
      if (this.servicePriceForm.value.address == "" || this.servicePriceForm.value.address == null) {
        this.alertMsg = 'Please Select Your Address';
        return false;
      }
      if (this.addressData._id == undefined) {
        this.alertMsg = 'Please Select Your Address';
        return false;
      }

      if (this.walletpayStatus) {
        if (this.walletAmount <= this.order_total) {
          this.usedWalletMoney = this.walletAmount;
        } else {
          this.usedWalletMoney = this.order_total;
        }
      }

      var save_booking_obj = {
        hour: localStorage.getItem('hour'),
        price: localStorage.getItem('price'),
        aq_status: this.aq_status,
        option: option,
        aq_id: JSON.parse(localStorage.getItem("aq_id")),
        aq_ans: JSON.parse(localStorage.getItem("aq_ans")),
        param: this.param,
        id: this.id,
        total_cost: this.order_total,
        actual_cost: Math.round(this.total),
        booking_date: (<HTMLInputElement>document.getElementById('booking_date')).value,
        booking_time: this.booking_time,
        notes: this.servicePriceForm.value.notes,
        instruction: servic_instruction,
        //address: this.servicePriceForm.value.address,
        address: this.addressData._id,
        promo_code_id: this.promo_code_id,
        tax: this.tax,
        before_tax_cost: this.total_before_tax,
        wallet_pay_status: this.walletpayStatus,
        used_wallet_money: this.usedWalletMoney
      };
     //console.log("booking form data ==>", save_booking_obj);
      //console.log(save_booking_obj); return false;
      form_data.append('pdata', JSON.stringify(save_booking_obj));
      /*var hour = localStorage.getItem('hour');
      var price = localStorage.getItem('price');
      var aq_status = this.aq_status;
      if(aq_status == 2) {
        var option = localStorage.getItem('option');
      }
      var aq_id_data = JSON.parse(localStorage.getItem("aq_id"));
      var param = this.param;
      var id = this.id;
      var total_cost = this.order_total;
      var actual_cost = this.total;
      var booking_date = (<HTMLInputElement>document.getElementById('booking_date')).value;
      var booking_time = this.booking_time;
      var notes = this.servicePriceForm.value.notes;
      var address = this.servicePriceForm.value.address;*/

      //console.log(this.myFiles);
      if (this.myFiles.length > 0) {
        for (var i = 0; i < this.myFiles.length; i++) {
          form_data.append("issue_image", this.myFiles[i]);
        }
      }
      this.spinnerService.show();
      this.api_service.HttpPostReqHeader('website/saveBooking', form_data, true, this.logtoken).then((response: any) => {
        if (response.success == true) {
          this.spinnerService.hide();
          //this.infoMessage = response.message;
          //console.log(response.data);
          this.router.navigateByUrl(`/booking-summary/${response.data}`)
            .then(() => {
              window.location.reload();
            });
        } else {
          this.spinnerService.hide();
          this.alertMsg = response.message;
        }
      });
    } else {
      alert("Sorry, Your default address country does not match with your current location country.");
    }
  }

  useWalletBalance(event) {
    if (event.currentTarget.checked) {
      this.walletpayStatus = 1;
    } else {
      this.walletpayStatus = 0;
      this.usedWalletMoney = 0;
    }
  }

  getDefaultAddress() {
    this.api_service.HttpGetReq(`website/getDefaultAddress/?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
         // console.log('address', response);
          if (response.success == true) {
            this.addressData = response.data;
            this.servicePriceForm.patchValue({
              address: response.data.house_no + ' ' + response.data.street_address + ' ' + response.data.city + ' ' + response.data.state + ' ' + response.data.zip_code
            });

            this.getServicePrices(this.logtoken, this.param, this.id, this.aq_status);
          } else {
            this.addressData = {};
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getUserAddresses() {
    this.api_service.HttpGetReq(`website/addressList?token=${this.logtoken}`, true)
      .then(
        (response: any) => {
          //console.log('c', response.data);
          this.alladdressData = response.data;
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }
  setDefaultAddress(address_id) {
    if (address_id) {
      const addressDetails = {
        address_id: address_id
      }
      this.api_service.HttpPostReqHeader('website/setAddressDefault', addressDetails, true, this.logtoken).then((response: any) => {
        if (response.success == true) {
          this.spinnerService.hide();
          ($('#addressSelect') as any).modal('hide');
          this.getDefaultAddress();
          this.getUserAddresses();
        } else {
          this.spinnerService.hide();
          /*this.infoMessageRed = response.message;
          setTimeout(()=>{
            this.infoMessageRed = "";
          }, 5000);*/
        }
      })
    }
  }

  saveAddress() {
    var lattitude = (<HTMLInputElement>document.getElementById('lat')).value;
    var longitude = (<HTMLInputElement>document.getElementById('long')).value;

    if (lattitude == '' || longitude == '') {
      alert('Please enter valid zip code');
    }
    if (this.addressForm.value.address_type == '' || this.addressForm.value.address_type == 0) {
      alert('Please select address type');
    }

    var address_data = {
      street_address: this.addressForm.value.street_address,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      zip_code: this.addressForm.value.zip_code,
      lattitude: lattitude,
      longitude: longitude,
      address_type: this.addressForm.value.address_type,
      house_no: this.addressForm.value.house_no,
      land_mark: this.addressForm.value.land_mark
    };

    //console.log(address_data); return false;

    this.api_service.HttpPostReqHeader('website/saveDefaultAddress', address_data, true, this.logtoken).then((response: any) => {
      if (response.success == true) {
        this.spinnerService.hide();
        ($('#addressAdd') as any).modal('hide');
        this.getDefaultAddress();
        this.getUserAddresses();
      }
      else {
        this.spinnerService.hide();
      }
    })
  }


  parseTime(s: any) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  convertHours(mins: any) {
    var hour = Math.floor(mins / 60);
    var mins1 = mins % 60;
    var converted = this.pad(hour, 2) + ':' + this.pad(mins1, 2);
    return converted;
  }

  pad(str: any, max: any) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  calculate_time_slot(chooseDate: any, start_time: any, end_time: any, interval: any) {
    this.timeSlotArray = [];
    var i, formatted_time;
    if (interval) {
      interval = interval;
    } else {
      interval = 30;
    }
    for (var i = start_time; i < end_time; i = i + interval) {
      formatted_time = this.convertHours(i);
      let result = moment(formatted_time, "HH:mm").format('h:mm A');
      this.timeSlotArray.push({
        result
      })
      //this.timeSlotArray.push(formatted_time);
    }
   // console.log("Time slot array ====> ", this.timeSlotArray);
    // for (let i = 0; i < this.timeSlotArray.length; i++) {
    //   ($('#slot-carousel') as any).trigger('add.owl.carousel', ['<div class="item" style="padding: 13px 17px;" (click)="getTime($event,"' + this.timeSlotArray[i].result + '")">' + this.timeSlotArray[i].result + '</div>']);
    // }
    // ($('#slot-carousel') as any).trigger('refresh.owl.carousel');
  }

  todayDateFormat(today) {
    //var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1; // Months start at 0!
    var dd = today.getDate();
    var hrs = today.getHours();
    var min = today.getMinutes();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hrs < 10) hrs = '0' + hrs;
    if (min < 10) min = '0' + min;

    var dateString = hrs + ':' + min;
    return dateString;
  }

}
