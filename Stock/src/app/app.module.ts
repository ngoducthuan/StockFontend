import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IgxFinancialChartModule, IgxLegendModule, IgxLineSeriesModule } from "igniteui-angular-charts";
import { DataServiceService } from "./data-service.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { DashboardComponent } from './dashboard/dashboard.component';
//import { IgxGridModule } from "igniteui-angular";
//import { IgxSparklineModule } from "igniteui-angular-charts";

const routes: Routes = [
  //{ path: 'stock-detail/:param', component: StockDetailComponent },
  //{ path: 'stock-detail/:param1/:param2', component: StockDetailComponent },
  { path: 'dashboard', component: DashboardComponent }
  //{ path: 'second-component', component: SecondComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    StockDetailComponent,
    DashboardComponent,
    UserComponent,
    LoginComponent,
    //DashboardComponent,
  ],
  imports: [
    NgApexchartsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    IgxFinancialChartModule,
    IgxLineSeriesModule,
    IgxLegendModule,
    AppRoutingModule,
    HttpClientModule,
  //  IgxGridModule,
    //IgxSparklineModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
