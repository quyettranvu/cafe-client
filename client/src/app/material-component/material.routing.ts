import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageCategoryComponent } from '../manage-category/manage-category.component';
import { ManageProductComponent } from '../manage-product/manage-product.component';
import { ManageOrderComponent } from '../manage-order/manage-order.component';
import { ViewBillComponent } from './dialog/view-bill/view-bill.component';
import { ManageUserComponent } from '../manage-user/manage-user.component';

//Connect with Router for all the elements in sidebar
export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: ManageCategoryComponent,
    canActivate: [RouteGuardService],
    data: {
      //manage category only admin
      expectedRole: ['admin'],
    },
  },
  {
    path: 'product',
    component: ManageProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'],
    },
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'],
    },
  },
  {
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'],
    },
  },
  {
    path: 'user',
    component: ManageUserComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'],
    },
  },
];
