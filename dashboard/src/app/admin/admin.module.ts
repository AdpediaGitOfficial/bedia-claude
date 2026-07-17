import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { QuillModule } from 'ngx-quill';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
//import { AppsService } from '../shared/services/apps.service';
import { TableService } from '../shared/services/table.service';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { UserListComponent } from './users/user-list/user-list.component';
import { PackageListComponent } from './packages/package-list/package-list.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { PackageAddComponent } from './packages/package-add/package-add.component';
import { CategoryAddComponent } from './category/category-add/category-add.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';
import { PackageEditComponent } from './packages/package-edit/package-edit.component';
import { PackageDetailComponent } from './packages/package-detail/package-detail.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { CategoryDetailComponent } from './category/category-detail/category-detail.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { OfflinepaymentAddComponent } from './offlinepayments/offlinepayment-add/offlinepayment-add.component';
import { OfflinepaymentListComponent } from './offlinepayments/offlinepayment-list/offlinepayment-list.component';
import { OnlinepaymentListComponent } from './onlinepayments/onlinepayment-list/onlinepayment-list.component';
import { OfflinepaymentDetailComponent } from './offlinepayments/offlinepayment-detail/offlinepayment-detail.component';
import { OnlinepaymentDetailComponent } from './onlinepayments/onlinepayment-detail/onlinepayment-detail.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { GalleryAddComponent } from './gallery/gallery-add/gallery-add.component';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './gallery/gallery-detail/gallery-detail.component';
import { GalleryEditComponent} from './gallery/gallery-edit/gallery-edit.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { WorkshopAddComponent } from './workshop/workshop-add/workshop-add.component';
import { WorkshopListComponent } from './workshop/workshop-list/workshop-list.component'; 
import { WorkshopDetailComponent } from './workshop/workshop-detail/workshop-detail.component';
import { WorkshopEditComponent} from './workshop/workshop-edit/workshop-edit.component';
import { FaqAddComponent } from './faq/faq-add/faq-add.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component'; 
import { FaqDetailComponent } from './faq/faq-detail/faq-detail.component';
import { FaqEditComponent} from './faq/faq-edit/faq-edit.component';
import { TermsAndConditionsAddComponent } from './termsAndConditions/termsAndConditions-add/termsAndConditions-add.component';
import { TermsAndConditionsListComponent } from './termsAndConditions/termsAndConditions-list/termsAndConditions-list.component'; 
import { TermsAndConditionsDetailComponent } from './termsAndConditions/termsAndConditions-detail/termsAndConditions-detail.component';
import { TermsAndConditionsEditComponent} from './termsAndConditions/termsAndConditions-edit/termsAndConditions-edit.component';
import { BookingListComponent } from './bookings/booking-list/booking-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BookingDetailComponent } from './bookings/booking-detail/booking-detail.component';
import { OpeningHoursFormComponent } from './openingHours/opening-hours_form/opening-hours-form.component';
import { OpeningHoursListComponent } from './openingHours/opening-hours-list/opening-hours-list.component';


const antdModule = [
    NzButtonModule,
    NzCardModule,
    NzAvatarModule,
    NzRateModule,
    NzBadgeModule,
    NzProgressModule,
    NzRadioModule,
    NzTableModule,
    NzDropDownModule,
    NzTimelineModule,
    NzTabsModule,
    NzTagModule,
    NzListModule,
    NzCalendarModule,
    NzToolTipModule,
    NzFormModule,
    NzModalModule,
    NzSelectModule,
    NzUploadModule,
    NzInputModule,
    NzPaginationModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzMessageModule,
    NzNotificationModule,
    NzBreadCrumbModule,
    NzDescriptionsModule,    
    NzDividerModule,
    NzSegmentedModule,
    NzTimePickerModule,    
    
]

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        QuillModule.forRoot(),
        FormsModule,
        EditorModule,
        ...antdModule
    ],
    declarations: [
        UserListComponent,
        PackageListComponent,
        CategoryListComponent,
        PackageAddComponent,
        CategoryAddComponent,
        CategoryEditComponent,
        PackageEditComponent,
        PackageDetailComponent,
        CategoryDetailComponent,
        UserDetailComponent,
        OfflinepaymentAddComponent,
        OfflinepaymentListComponent,
        OnlinepaymentListComponent,
        OfflinepaymentDetailComponent,
        OnlinepaymentDetailComponent,
        ReviewListComponent,
        GalleryAddComponent,
        GalleryListComponent,
        GalleryDetailComponent,
        GalleryEditComponent,
        WorkshopAddComponent,
        WorkshopListComponent,
        WorkshopDetailComponent,
        WorkshopEditComponent,
        FaqAddComponent,
        FaqListComponent,
        FaqDetailComponent,
        FaqEditComponent,  
        TermsAndConditionsAddComponent,
        TermsAndConditionsListComponent,
        TermsAndConditionsDetailComponent,
        TermsAndConditionsEditComponent,   
        BookingListComponent   ,
        BookingDetailComponent,
        OpeningHoursListComponent,
        OpeningHoursFormComponent,
        
       
    ],
    providers: [
        ThemeConstantService,
      //  AppsService,
        TableService
    ]
})

export class AdminModule {}