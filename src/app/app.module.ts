import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
//import { LanguageInterceptor } from './interceptors/language.interceptor';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { environment } from 'src/environments/environment';
//import * as bootstrap from "bootstrap";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import * as $ from "jquery";
import * as moment from 'moment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ServiceCategoryComponent } from './pages/service-category/service-category.component';
import { ServiceSubCategoryComponent } from './pages/service-sub-category/service-sub-category.component';
import { ServiceChargeComponent } from './pages/service-charge/service-charge.component';
import { BookingSummaryComponent } from './pages/booking-summary/booking-summary.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { PaymentOptionComponent } from './pages/payment-option/payment-option.component';
import { SrAddressListComponent } from './pages/sr-address-list/sr-address-list.component';
import { SrAddressAddComponent } from './pages/sr-address-add/sr-address-add.component';
import { SrAddressEditComponent } from './pages/sr-address-edit/sr-address-edit.component';
import { MyBookingListComponent } from './pages/my-booking-list/my-booking-list.component';
import { UploadDocumentsComponent } from './pages/upload-documents/upload-documents.component';
import { UploadedDocumentListComponent } from './pages/uploaded-document-list/uploaded-document-list.component';
import { WorkingAreaAddComponent } from './pages/working-area-add/working-area-add.component';
import { WorkingAreaListComponent } from './pages/working-area-list/working-area-list.component';
import { MyBookingDetailsComponent } from './pages/my-booking-details/my-booking-details.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { SpBookingListComponent } from './pages/sp-booking-list/sp-booking-list.component';
import { SpBookingDetailsComponent } from './pages/sp-booking-details/sp-booking-details.component';
import { ServiceListComponent } from './pages/service-list/service-list.component';
import { WorkingHoursComponent } from './pages/working-hours/working-hours.component';
import { AddServiceCategoryComponent } from './pages/add-service-category/add-service-category.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { SrNotificationComponent } from './pages/sr-notification/sr-notification.component';
import { QueryServiceListComponent } from './pages/query-service-list/query-service-list.component';
import { QueryServiceDetailsComponent } from './pages/query-service-details/query-service-details.component';
import { QueryBookingsComponent } from './pages/query-bookings/query-bookings.component';
import { MyQueryListComponent } from './pages/my-query-list/my-query-list.component';
import { MyQueryDetailsComponent } from './pages/my-query-details/my-query-details.component';
import { ServiceProvidersReplyComponent } from './pages/service-providers-reply/service-providers-reply.component';
import { QueryReplyDetailsComponent } from './pages/query-reply-details/query-reply-details.component';
import { QueryBookingDetailsComponent } from './pages/query-booking-details/query-booking-details.component';
import { SpQueryBookingListComponent } from './pages/sp-query-booking-list/sp-query-booking-list.component';
import { SpQueryBookingDetailsComponent } from './pages/sp-query-booking-details/sp-query-booking-details.component';
import { SrWalletComponent } from './pages/sr-wallet/sr-wallet.component';
import { SrWalletTransactionComponent } from './pages/sr-wallet-transaction/sr-wallet-transaction.component';
import { SpEarningListComponent } from './pages/sp-earning-list/sp-earning-list.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { ChangeLanguageComponent } from './pages/change-language/change-language.component';

const logtoken = localStorage.getItem('LoginToken');
//console.log("Login token => ", logtoken);
const config: SocketIoConfig = {
  url: environment.SOCKET_ENDPOINT,
  options: {transports: ['websocket'], query: { token: logtoken, forceNew: 'true' }}
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    MenuComponent,
    AboutComponent,
    ContactComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ServiceCategoryComponent,
    ServiceSubCategoryComponent,
    ServiceChargeComponent,
    BookingSummaryComponent,
    PaymentComponent,
    SuccessPageComponent,
    PaymentOptionComponent,
    SrAddressListComponent,
    SrAddressAddComponent,
    SrAddressEditComponent,
    MyBookingListComponent,
    UploadDocumentsComponent,
    UploadedDocumentListComponent,
    WorkingAreaAddComponent,
    WorkingAreaListComponent,
    MyBookingDetailsComponent,
    TrackingComponent,
    SpBookingListComponent,
    SpBookingDetailsComponent,
    ServiceListComponent,
    WorkingHoursComponent,
    AddServiceCategoryComponent,
    NotificationComponent,
    SrNotificationComponent,
    QueryServiceListComponent,
    QueryServiceDetailsComponent,
    QueryBookingsComponent,
    MyQueryListComponent,
    MyQueryDetailsComponent,
    ServiceProvidersReplyComponent,
    QueryReplyDetailsComponent,
    QueryBookingDetailsComponent,
    SpQueryBookingListComponent,
    SpQueryBookingDetailsComponent,
    SrWalletComponent,
    SrWalletTransactionComponent,
    SpEarningListComponent,
    HelpCenterComponent,
    ChangeLanguageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	FormsModule,
	ReactiveFormsModule,
	NgxSpinnerModule,
	ToastrModule.forRoot(),
  SocketIoModule.forRoot(config),
	HttpClientModule,
	Ng4LoadingSpinnerModule.forRoot(),
	BrowserAnimationsModule,
	Ng2TelInputModule,
	NgxPaginationModule,
	AgmCoreModule.forRoot({
		apiKey: 'AIzaSyA-D0BU9p64xEqJI6pQOGguMoPV5NTJ6T4',
		libraries: ['places']
	}),
  AgmDirectionModule,
  TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
})
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  //providers: [{provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true}, HttpClient],
  bootstrap: [AppComponent],

})
export class AppModule { }
