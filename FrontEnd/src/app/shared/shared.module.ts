import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { EditUserComponent } from './edit-user/edit-user.component';
import {InputMaskModule} from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { CreateUserComponent } from './create-user/create-user.component';
import { PasswordModule } from 'primeng/password';
import { CreateGroupComponent } from './create-group/create-group.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { UserPipe } from '../services/user.pipe';
import { AddOrEditUserComponent } from './add-or-edit-user/add-or-edit-user.component';


@NgModule({
  declarations: [
    EditUserComponent,
    CreateUserComponent,
    CreateGroupComponent,
    UserPipe,
    AddOrEditUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    InputMaskModule,
    InputTextModule,
    PasswordModule,
    DynamicDialogModule,
    MultiSelectModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    EditUserComponent,
    CreateUserComponent,
    CreateGroupComponent,
    InputMaskModule,
    InputTextModule,
    PasswordModule,
    DynamicDialogModule,
    UserPipe,
    AddOrEditUserComponent
  ]
})
export class SharedModule { }
