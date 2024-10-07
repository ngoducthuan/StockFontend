import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stock-detail', component: StockDetailComponent },
  { path: 'stock-detail/:stockCode', component: StockDetailComponent },
  { path: 'stock-detail/:stockCode1/:stockCode2', component: StockDetailComponent },
  { path: 'user', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  // Tuyến đường mặc định, điều hướng đến Dashboard
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Tuyến đường 404
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppRoutingModule { }
