import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
        {
            path: 'dashboard',
            loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        },
        //Admin
        {
            path: 'admin',
            data: {
                title: 'admin'
            },
            children: [
                {
                    path: '',
                    redirectTo: '/dashboard',
                    pathMatch: 'full'
                }, 
                {
                    path: '',
                    loadChildren: () => import('../../admin/admin.module').then(m => m.AdminModule)
                },
            ]    
        },
    
     
    
];