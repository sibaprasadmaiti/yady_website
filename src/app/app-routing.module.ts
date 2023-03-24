import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change_password', component: ChangePasswordComponent },
  { path: 'service-category', component: ServiceCategoryComponent },
  { path: 'service-sub-category/:cat_id', component: ServiceSubCategoryComponent },
  { path: 'service-charges/:token/:param/:id/:aq_status', component: ServiceChargeComponent },
  { path: 'booking-summary/:booking_id', component: BookingSummaryComponent },
  { path: 'payment/:booking_id', component: PaymentComponent },
  { path: 'success/:type', component: SuccessPageComponent },
  { path: 'payment-option', component: PaymentOptionComponent },
  { path: 'my-address-list', component: SrAddressListComponent },
  { path: 'my-address-add', component: SrAddressAddComponent },
  { path: 'my-address-edit/:address_id', component: SrAddressEditComponent },
  { path: 'my-booking-list', component: MyBookingListComponent },
  { path: 'my-booking-details/:booking_id', component: MyBookingDetailsComponent },
  { path: 'upload-documents', component: UploadDocumentsComponent },
  { path: 'document-list', component: UploadedDocumentListComponent },
  { path: 'working-area-add', component: WorkingAreaAddComponent },
  { path: 'working-area-list', component: WorkingAreaListComponent },
  { path: 'tracking/:booking_id', component: TrackingComponent },
  { path: 'sp-booking-list', component: SpBookingListComponent },
  { path: 'sp-booking-details/:booking_id', component: SpBookingDetailsComponent },
  { path: 'service-list', component: ServiceListComponent },
  { path: 'working-hours', component: WorkingHoursComponent },
  { path: 'add-service-category', component: AddServiceCategoryComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'sr-notification', component: SrNotificationComponent },
  { path: 'query-request-list', component: QueryServiceListComponent },
  { path: 'query-request-details/:query_service_id', component: QueryServiceDetailsComponent },
  { path: 'query-bookings', component: QueryBookingsComponent },
  { path: 'my-query-list', component: MyQueryListComponent },
  { path: 'my-query-details/:query_service_id', component: MyQueryDetailsComponent },
  { path: 'query-reply-list/:query_service_id', component: ServiceProvidersReplyComponent },
  { path: 'query-reply-details/:query_service_assign_id', component: QueryReplyDetailsComponent },
  { path: 'query-booking-details/:query_booking_id', component: QueryBookingDetailsComponent },
  { path: 'sp-query-booking-list', component: SpQueryBookingListComponent },
  { path: 'sp-query-booking-details/:query_booking_id', component: SpQueryBookingDetailsComponent },
  { path: 'sr-wallet', component: SrWalletComponent },
  { path: 'sr-wallet-transaction', component: SrWalletTransactionComponent },
  { path: 'sp-earning-list', component: SpEarningListComponent },
  { path: 'help-center', component: HelpCenterComponent },
  { path: 'change-language', component: ChangeLanguageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
