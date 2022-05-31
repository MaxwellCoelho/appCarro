import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminPage } from './admin.page';
import { PermissionPage } from './permission/permission.page';
import { CustomerPage } from './customer/customer.page';

import { AdminPageRoutingModule } from './admin-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdminPageRoutingModule
  ],
  providers: [
    FormBuilder
  ],
  declarations: [
    AdminPage,
    PermissionPage,
    CustomerPage
  ]
})
export class AdminPageModule {}
