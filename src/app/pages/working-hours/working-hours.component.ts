import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.css']
})
export class WorkingHoursComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  userType = Number(localStorage.getItem('user_type'));
  message: any;
  workingHourData: any;
  mondayFromTime: any;
  mondayToTime: any;
  tuesdayFromTime: any;
  tuesdayToTime: any;
  wednesdayFromTime: any;
  wednesdayToTime: any;
  thursdayFromTime: any;
  thursdayToTime: any;
  fridayFromTime: any;
  fridayToTime: any;
  saturdayFromTime: any;
  saturdayToTime: any;
  sundayFromTime: any;
  sundayToTime: any;
  onlineStatus = 0;
  emergencyServiceStatus = 0;
  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;
  infoMessageRed = "";
  onoffMessage = "";
  newNotification = false;

  constructor(public formbuilder: FormBuilder,
    private router: Router, public api_service: ApiServiceService,
    private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService) {

  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null || this.userType != 2) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.getWorkingHours();
    this.getOnlineStatus();
    this.getNewNotification();
  }

  getWorkingHours() {
    var token = this.logtoken;
    this.spinnerService.show();

    this.api_service.HttpGetReq(`website/getWorkingHours/?token=${token}`, true)
      .then(
        (response: any) => {
          //console.log('working hours list', response);
          if (response.success == true) {
            this.spinnerService.hide();
            this.workingHourData = response.data;
            this.emergencyServiceStatus = response.data.emergency_service_status;

            this.monday = response.data.monday;
            this.tuesday = response.data.tuesday;
            this.wednesday = response.data.wednesday;
            this.thursday = response.data.thursday;
            this.friday = response.data.friday;
            this.saturday = response.data.saturday;
            this.sunday = response.data.sunday;

            this.mondayFromTime = this.changeTimeFormat(response.data.monday_from_hour + ' ' + response.data.monday_from_hour_unit);
            this.mondayToTime = this.changeTimeFormat(response.data.monday_to_hour + ' ' + response.data.monday_to_hour_unit);

            this.tuesdayFromTime = this.changeTimeFormat(response.data.tuesday_from_hour + ' ' + response.data.tuesday_from_hour_unit);
            this.tuesdayToTime = this.changeTimeFormat(response.data.tuesday_to_hour + ' ' + response.data.tuesday_to_hour_unit);

            this.wednesdayFromTime = this.changeTimeFormat(response.data.wednesday_from_hour + ' ' + response.data.wednesday_from_hour_unit);
            this.wednesdayToTime = this.changeTimeFormat(response.data.wednesday_to_hour + ' ' + response.data.wednesday_to_hour_unit);

            this.thursdayFromTime = this.changeTimeFormat(response.data.thursday_from_hour + ' ' + response.data.thursday_from_hour_unit);
            this.thursdayToTime = this.changeTimeFormat(response.data.thursday_to_hour + ' ' + response.data.thursday_to_hour_unit);

            this.fridayFromTime = this.changeTimeFormat(response.data.friday_from_hour + ' ' + response.data.friday_from_hour_unit);
            this.fridayToTime = this.changeTimeFormat(response.data.friday_to_hour + ' ' + response.data.friday_to_hour_unit);

            this.saturdayFromTime = this.changeTimeFormat(response.data.saturday_from_hour + ' ' + response.data.saturday_from_hour_unit);
            this.saturdayToTime = this.changeTimeFormat(response.data.saturday_to_hour + ' ' + response.data.saturday_to_hour_unit);

            this.sundayFromTime = this.changeTimeFormat(response.data.sunday_from_hour + ' ' + response.data.sunday_from_hour_unit);
            this.sundayToTime = this.changeTimeFormat(response.data.sunday_to_hour + ' ' + response.data.sunday_to_hour_unit);
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  getOnlineStatus() {
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getOnlineStatus/?token=${this.logtoken}`, true)
      .then((response: any) => {
        //console.log("online status ", response);

        if (response.success === true) {
          this.spinnerService.hide();
          this.onlineStatus = response.data.online_status;
        } else {
          this.spinnerService.hide();
        }
      },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  changeday(event: any, day: any) {
    if (day == "monday") {
      if (event.target.checked)
        this.monday = 1;
      else
        this.monday = 0;
    }
    if (day == "tuesday") {
      if (event.target.checked)
        this.tuesday = 1;
      else
        this.tuesday = 0;
    }
    if (day == "wednesday") {
      if (event.target.checked)
        this.wednesday = 1;
      else
        this.wednesday = 0;
    }
    if (day == "thursday") {
      if (event.target.checked)
        this.thursday = 1;
      else
        this.thursday = 0;
    }
    if (day == "friday") {
      if (event.target.checked)
        this.friday = 1;
      else
        this.friday = 0;
    }
    if (day == "saturday") {
      if (event.target.checked)
        this.saturday = 1;
      else
        this.saturday = 0;
    }
    if (day == "sunday") {
      if (event.target.checked)
        this.sunday = 1;
      else
        this.sunday = 0;
    }
  }

  changeTimeFormat(time: any) {
    // var time = "04:15 PM";
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes;
  }

  changeTimeFormat12Hours(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
  emergencyService(event: any) {
    let clickedElement = event.target || event.srcElement;
    let temp = clickedElement.parentNode;
    for (let i = 0; i < temp.childNodes.length; i++) {
      if (temp.childNodes[i].nodeName === 'BUTTON') {
        if (!temp.childNodes[i].classList.contains('active')) {
          this.emergencyServiceStatus = 1;
        } else {
          this.emergencyServiceStatus = 0;
        }
      }
    }
  }
  onlineOffline(event: any){
    let clickedElement = event.target || event.srcElement;
    let temp = clickedElement.parentNode;
    for (let i = 0; i < temp.childNodes.length; i++) {
      if (temp.childNodes[i].nodeName === 'BUTTON') {
        if (!temp.childNodes[i].classList.contains('active')) {
          this.onlineStatusChange(1);
        } else {
          this.onlineStatusChange(0);
        }
      }
    }
  }

  onlineStatusChange(status: any){
    console.log(status);

    this.spinnerService.show();
    var dataObj = {online_status: status};
    this.api_service.HttpPostReqHeader('website/onlineStatusChange', dataObj, true, this.logtoken).then((response: any) => {
      //console.log("online status change ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.onoffMessage = response.message;
        // this.message = "Working hours save successfully";
        // ($('#successModal') as any).modal('show');
        setTimeout(() => {
          this.onoffMessage = "";
        }, 4000);
      } else {
        this.spinnerService.hide();
        this.onoffMessage = response.message;
        setTimeout(() => {
          this.onoffMessage = "";
        }, 4000);
      }
    })
  }

  addWorkHour() {
    //monday
    var mondayFromHour = (<HTMLInputElement>document.getElementById('monday_from_hour')).value;
    var mondayToHour = (<HTMLInputElement>document.getElementById('monday_to_hour')).value;
    if (this.monday == 1 && mondayFromHour == "" && !mondayFromHour) {
      this.infoMessageRed = "Please add monday from hour."
      return false;
    }
    if (this.monday == 1 && mondayToHour == "" && !mondayToHour) {
      this.infoMessageRed = "Please add monday To hour."
      return false;
    }
    //tuesday
    var tuesdayFromHour = (<HTMLInputElement>document.getElementById('tuesday_from_hour')).value;
    var tuesdayToHour = (<HTMLInputElement>document.getElementById('tuesday_to_hour')).value;
    if (this.tuesday == 1 && tuesdayFromHour == "" && !tuesdayFromHour) {
      this.infoMessageRed = "Please add tuesday from hour."
      return false;
    }
    if (this.tuesday == 1 && tuesdayToHour == "" && !tuesdayToHour) {
      this.infoMessageRed = "Please add tuesday To hour."
      return false;
    }
    //wednesday
    var wednesdayFromHour = (<HTMLInputElement>document.getElementById('wednesday_from_hour')).value;
    var wednesdayToHour = (<HTMLInputElement>document.getElementById('wednesday_to_hour')).value;
    if (this.wednesday == 1 && wednesdayFromHour == "" && !wednesdayFromHour) {
      this.infoMessageRed = "Please add wednesday from hour."
      return false;
    }
    if (this.wednesday == 1 && wednesdayToHour == "" && !wednesdayToHour) {
      this.infoMessageRed = "Please add wednesday To hour."
      return false;
    }
    //thursday
    var thursdayFromHour = (<HTMLInputElement>document.getElementById('thursday_from_hour')).value;
    var thursdayToHour = (<HTMLInputElement>document.getElementById('thursday_to_hour')).value;
    if (this.thursday == 1 && thursdayFromHour == "" && !thursdayFromHour) {
      this.infoMessageRed = "Please add thursday from hour."
      return false;
    }
    if (this.thursday == 1 && thursdayToHour == "" && !thursdayToHour) {
      this.infoMessageRed = "Please add thursday To hour."
      return false;
    }

    //friday
    var fridayFromHour = (<HTMLInputElement>document.getElementById('friday_from_hour')).value;
    var fridayToHour = (<HTMLInputElement>document.getElementById('friday_to_hour')).value;
    if (this.friday == 1 && fridayFromHour == "" && !fridayFromHour) {
      this.infoMessageRed = "Please add friday from hour."
      return false;
    }
    if (this.friday == 1 && fridayToHour == "" && !fridayToHour) {
      this.infoMessageRed = "Please add friday To hour."
      return false;
    }
    //saturday
    var saturdayFromHour = (<HTMLInputElement>document.getElementById('saturday_from_hour')).value;
    var saturdayToHour = (<HTMLInputElement>document.getElementById('saturday_to_hour')).value;
    if (this.saturday == 1 && saturdayFromHour == "" && !saturdayFromHour) {
      this.infoMessageRed = "Please add saturday from hour."
      return false;
    }
    if (this.saturday == 1 && saturdayToHour == "" && !saturdayToHour) {
      this.infoMessageRed = "Please add saturday To hour."
      return false;
    }
    //sunday
    var sundayFromHour = (<HTMLInputElement>document.getElementById('sunday_from_hour')).value;
    var sundayToHour = (<HTMLInputElement>document.getElementById('sunday_to_hour')).value;
    if (this.sunday == 1 && sundayFromHour == "" && !sundayFromHour) {
      this.infoMessageRed = "Please add sunday from hour."
      return false;
    }
    if (this.sunday == 1 && sundayToHour == "" && !sundayToHour) {
      this.infoMessageRed = "Please add sunday To hour."
      return false;
    }

    this.spinnerService.show();

    var monday_from_hour = this.changeTimeFormat12Hours(mondayFromHour).split(" ");
    var monday_to_hour = this.changeTimeFormat12Hours(mondayToHour).split(" ");

    var tuesday_from_hour = this.changeTimeFormat12Hours(tuesdayFromHour).split(" ");
    var tuesday_to_hour = this.changeTimeFormat12Hours(tuesdayToHour).split(" ");

    var wednesday_from_hour = this.changeTimeFormat12Hours(wednesdayFromHour).split(" ");
    var wednesday_to_hour = this.changeTimeFormat12Hours(wednesdayToHour).split(" ");

    var thursday_from_hour = this.changeTimeFormat12Hours(thursdayFromHour).split(" ");
    var thursday_to_hour = this.changeTimeFormat12Hours(thursdayToHour).split(" ");

    var friday_from_hour = this.changeTimeFormat12Hours(fridayFromHour).split(" ");
    var friday_to_hour = this.changeTimeFormat12Hours(fridayFromHour).split(" ");

    var saturday_from_hour = this.changeTimeFormat12Hours(saturdayFromHour).split(" ");
    var saturday_to_hour = this.changeTimeFormat12Hours(saturdayToHour).split(" ");

    var sunday_from_hour = this.changeTimeFormat12Hours(sundayFromHour).split(" ");
    var sunday_to_hour = this.changeTimeFormat12Hours(sundayToHour).split(" ");

    //this.spinnerService.show();
    var dataObj = {
      monday: this.monday,
      monday_from_hour: monday_from_hour[0] && this.monday == 1 ? monday_from_hour[0] : '00:00',
      monday_from_hour_unit: monday_from_hour[1] ? monday_from_hour[1] : 'AM',
      monday_to_hour: monday_to_hour[0] && this.monday == 1 ? monday_to_hour[0] : '00:00',
      monday_to_hour_unit: monday_to_hour[1] ? monday_to_hour[1] : 'PM',
      tuesday: this.tuesday,
      tuesday_from_hour: tuesday_from_hour[0] && this.tuesday == 1 ? tuesday_from_hour[0] : '00:00',
      tuesday_from_hour_unit: tuesday_from_hour[1] ? tuesday_from_hour[1] : 'AM',
      tuesday_to_hour: tuesday_to_hour[0] && this.tuesday == 1 ? tuesday_to_hour[0] : '00:00',
      tuesday_to_hour_unit: tuesday_to_hour[1] ? tuesday_to_hour[1] : 'PM',
      wednesday: this.wednesday,
      wednesday_from_hour: wednesday_from_hour[0] && this.wednesday == 1 ? wednesday_from_hour[0] : '00:00',
      wednesday_from_hour_unit: wednesday_from_hour[1] ? wednesday_from_hour[1] : 'AM',
      wednesday_to_hour: wednesday_to_hour[0] && this.wednesday == 1 ? wednesday_to_hour[0] : '00:00',
      wednesday_to_hour_unit: wednesday_to_hour[1] ? wednesday_to_hour[1] : 'PM',
      thursday: this.thursday,
      thursday_from_hour: thursday_from_hour[0] && this.thursday == 1 ? thursday_from_hour[0] : '00:00',
      thursday_from_hour_unit: thursday_from_hour[1] ? thursday_from_hour[1] : 'AM',
      thursday_to_hour: thursday_to_hour[0] && this.thursday == 1 ? thursday_to_hour[0] : '00:00',
      thursday_to_hour_unit: thursday_to_hour[1] ? thursday_to_hour[1] : 'PM',
      friday: this.friday,
      friday_from_hour: friday_from_hour[0] && this.friday == 1 ? friday_from_hour[0] : '00:00',
      friday_from_hour_unit: friday_from_hour[1] ? friday_from_hour[1] : 'AM',
      friday_to_hour: friday_to_hour[0] && this.friday == 1 ? friday_to_hour[0] : '00:00',
      friday_to_hour_unit: friday_to_hour[1] ? friday_to_hour[1] : 'PM',
      saturday: this.saturday,
      saturday_from_hour: saturday_from_hour[0] && this.saturday == 1 ? saturday_from_hour[0] : '00:00',
      saturday_from_hour_unit: saturday_from_hour[1] ? saturday_from_hour[1] : 'AM',
      saturday_to_hour: saturday_to_hour[0] && this.saturday == 1 ? saturday_to_hour[0] : '00:00',
      saturday_to_hour_unit: saturday_to_hour[1] ? saturday_to_hour[1] : 'PM',
      sunday: this.sunday,
      sunday_from_hour: sunday_from_hour[0] && this.sunday == 1 ? sunday_from_hour[0] : '00:00',
      sunday_from_hour_unit: sunday_from_hour[1] ? sunday_from_hour[1] : 'AM',
      sunday_to_hour: sunday_to_hour[0] && this.sunday == 1 ? sunday_to_hour[0] : '00:00',
      sunday_to_hour_unit: sunday_to_hour[1] ? sunday_to_hour[1] : 'PM',
      emergency_service_status: this.emergencyServiceStatus
    };
    console.log(dataObj);

    this.api_service.HttpPostReqHeader('website/saveWorkingHours', dataObj, true, this.logtoken).then((response: any) => {
      //console.log("save working hour ", response);
      if (response.success == true) {
        this.spinnerService.hide();
        this.message = "Working hours save successfully";
        ($('#successModal') as any).modal('show');
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        this.spinnerService.hide();
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
