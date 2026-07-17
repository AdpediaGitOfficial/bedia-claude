import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard'; 
import { UserListComponent } from './users/user-list/user-list.component';
import { PackageListComponent } from './packages/package-list/package-list.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import {PackageAddComponent} from './packages/package-add/package-add.component';
import { CategoryAddComponent } from './category/category-add/category-add.component';
import {CategoryEditComponent} from './category/category-edit/category-edit.component';
import {PackageEditComponent} from './packages/package-edit/package-edit.component';
import {PackageDetailComponent} from './packages/package-detail/package-detail.component';
import {CategoryDetailComponent} from './category/category-detail/category-detail.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { OfflinepaymentAddComponent } from './offlinepayments/offlinepayment-add/offlinepayment-add.component';
import { OfflinepaymentListComponent } from './offlinepayments/offlinepayment-list/offlinepayment-list.component';
import {OnlinepaymentListComponent} from './onlinepayments/onlinepayment-list/onlinepayment-list.component';
import { OfflinepaymentDetailComponent } from './offlinepayments/offlinepayment-detail/offlinepayment-detail.component';
import { OnlinepaymentDetailComponent } from './onlinepayments/onlinepayment-detail/onlinepayment-detail.component';
import { ReviewListComponent } from './review/review-list/review-list.component';
import { GalleryAddComponent } from './gallery/gallery-add/gallery-add.component';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './gallery/gallery-detail/gallery-detail.component';
import { GalleryEditComponent} from './gallery/gallery-edit/gallery-edit.component';
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
import { BookingDetailComponent } from './bookings/booking-detail/booking-detail.component';
import { OpeningHoursFormComponent } from './openingHours/opening-hours_form/opening-hours-form.component';
import { OpeningHoursListComponent } from './openingHours/opening-hours-list/opening-hours-list.component';


const routes: Routes = [
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'users',
            headerDisplay: "none",
            filterType: 'all'
        }
    },
    {
        path: 'users/upcoming',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'upcoming-users',
            headerDisplay: "none",
            filterType: 'upcoming'
        }
    },
    {
        path: 'users/expired',
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'expired-users',
            headerDisplay: "none",
            filterType: 'expired'
        }
    },
    
    {
        path: 'packages',
        component: PackageListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'users',
            headerDisplay: "none"
        }
    },
    {
        path: 'categories',
        component: CategoryListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'categories',
            headerDisplay: "none"
        }
    },
    {
        path: 'package-add',
        component: PackageAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'package-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'category-add',
        component: CategoryAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'category-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'category-edit/:id',
        component: CategoryEditComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Category Edit',
            headerDisplay: "none"
        }
    },
    {
        path: 'package-edit/:id',
        component: PackageEditComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Package Edit',
            headerDisplay: "none"
        }
    },
    {
        path: 'package-detail/:id',
        component: PackageDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Package Detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'category-detail/:id',
        component: CategoryDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Category Detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'user-detail/:id',
        component: UserDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'User Detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'offlinepayment-add/:id/:fullName',
        component: OfflinepaymentAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'offlinepayment-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'offlinepayments',
        component: OfflinepaymentListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'offlinepayment-list',
            headerDisplay: "none"
        }
    },
    {
        path: 'onlinepayments',
        component: OnlinepaymentListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'onlinepayment-list',
            headerDisplay: "none"
        }
    },
    {
        path: 'offlinepayment-detail/:id',
        component: OfflinepaymentDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'offlinepayment-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'onlinepayment-detail/:id',
        component: OnlinepaymentDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'onlinepayment-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'reviews',
        component: ReviewListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'reviews',
            headerDisplay: "none"
        }
    },
    
    {
        path: 'gallery-add',
        component: GalleryAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'gallery-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'gallery',
        component: GalleryListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'gallery-list',
            headerDisplay: "none"
        }
    },
   
    {
        path: 'gallery-detail/:id',
        component: GalleryDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'gallery-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'gallery-edit/:id',
        component: GalleryEditComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Gallery Edit',
            headerDisplay: "none"
        }
    },
      {
        path: 'faq-add',
        component: FaqAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'faq-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'faqs',
        component: FaqListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'faq-list',
            headerDisplay: "none"
        }
    },   
    {
        path: 'faq-detail/:id',
        component: FaqDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'faq-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'faq-edit/:id',
        component: FaqEditComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Faq Edit',
            headerDisplay: "none"
        }
    },
    {
        path: 'workshop-add',
        component: WorkshopAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'workshop-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'workshops',
        component: WorkshopListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'workshop-list',
            headerDisplay: "none"
        }
    },   
    {
        path: 'workshop-detail/:id',
        component: WorkshopDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'workshop-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'workshop-edit/:id',
        component: WorkshopAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Workshop Edit',
            headerDisplay: "none"
        }
    },
     {
        path: 'termsAndConditions-add',
        component: TermsAndConditionsAddComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'termsAndConditions-add',
            headerDisplay: "none"
        }
    },
  
    {
        path: 'termsAndConditions',
        component: TermsAndConditionsListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'termsAndConditions-list',
            headerDisplay: "none"
        }
    },   
    {
        path: 'termsAndConditions-detail/:id',
        component: TermsAndConditionsDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'termsAndConditions-detail',
            headerDisplay: "none"
        }
    },
    {
        path: 'termsAndConditions-edit/:id',
        component: TermsAndConditionsEditComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'TermsAndConditions Edit',
            headerDisplay: "none"
        }
    },    
    {
        path: 'bookings',
        component: BookingListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'booking-list',
            headerDisplay: "none"
        }
    },  
       
    {
        path: 'booking-detail/:id',
        component: BookingDetailComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'booking-list',
            headerDisplay: "none"
        }
    },   

        {
        path: 'openingHours-add',
        component: OpeningHoursFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'openingHours-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'openingHours-edit/:id',
        component: OpeningHoursFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'openingHours-add',
            headerDisplay: "none"
        }
    },
    {
        path: 'opening-hours',
        component: OpeningHoursListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'openingHours-list',
            headerDisplay: "none"
        }
    },   


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }
