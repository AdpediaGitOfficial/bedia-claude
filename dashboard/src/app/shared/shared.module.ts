import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { SearchPipe } from './pipes/search.pipe';

// import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        NzIconModule,
        PerfectScrollbarModule,
         SearchPipe,

    //     NzCardModule,
    // NzAvatarModule,
    ],
    imports: [
        RouterModule,
        CommonModule,
        NzIconModule,
        NzToolTipModule,
        PerfectScrollbarModule,
    //     NzCardModule,
    // NzAvatarModule
    ],
    declarations: [
        SearchPipe
    ],
    providers: [
        ThemeConstantService
    ]
})

export class SharedModule { }
