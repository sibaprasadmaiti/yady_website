import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { SocketService } from '../../services/socket.service';
import { Socket } from 'ngx-socket-io';
import { AgmDirectionModule } from 'agm-direction';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  logtoken = localStorage.getItem('LoginToken');
  booking_id: null;
  srlat: any;
  srLong: any;
  splat: any;
  spLong: any;
  srMarkerImg = "./assets/images/sr-track.png";
  spMarkerImg = "./assets/images/sp-track.png";
  current_latLang: any;
  polyLineColor = "blue";
  origin: any;
  destination: any;
  renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#00B2B2',strokeWeight: '6' }
}

markerOptions = {
    origin: {
        icon: './assets/images/sr-track.png',
    },
    destination: {
        icon: './assets/images/sp-track.png',
        label: 'Service Requester',
        opacity: 0.8,
    },
}

  constructor(private route: ActivatedRoute, private router: Router, public api_service: ApiServiceService, private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastrService, private socket: Socket) {

    // if (navigator) {
    //   navigator.geolocation.getCurrentPosition(pos => {
    //     this.lng = +pos.coords.longitude;
    //     this.lat = +pos.coords.latitude;
    //     console.log("lat => ", this.lat);
    //     console.log("lng => ", this.lng);
    //   });
    // }

  }

  ngOnInit() {
    if (this.logtoken == '' || this.logtoken == null) {
      this.router.navigateByUrl('/')
        .then(() => {
          localStorage.clear();
          window.location.reload();
        });
    }
    this.route.params.subscribe(params => {
      this.booking_id = params.booking_id;
    });
    this.getDefaultAddress();
    this.getSPLocation();
    this.socket.on('connected', message => {
      if (message == 'Welcome') {
        console.log("socket is connected for tracking.....");
        this.socket.on('locations', data => {
          console.log("location data => ", data);
          this.origin = { lat: data.latitude, lng: data.longitude };
        });
      }
    });
  }

  getDefaultAddress(){
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getDefaultAddress/?token=${token}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Responce =>', response.data);
            this.srlat = parseFloat(response.data.lattitude);
            this.srLong = parseFloat(response.data.longitude);

            this.destination = { lat: this.srlat, lng: this.srLong };

            // this.customerlat = 22.5734368;
            // this.customerLong = 88.4305629;
            this.spinnerService.hide();
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  getSPLocation(){
    var token = this.logtoken;
    this.spinnerService.show();
    this.api_service.HttpGetReq(`website/getSPLocation/?token=${token}&booking_id=${this.booking_id}`, true)
      .then(
        (response: any) => {
          if (response.success == true) {
            //console.log('Sp Responce =>', response.data);
            this.splat = parseFloat(response.data.latitude);
            this.spLong = parseFloat(response.data.longitude);
            this.origin = { lat: this.splat, lng: this.spLong };
            this.spinnerService.hide();
          } else {
            this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

}
