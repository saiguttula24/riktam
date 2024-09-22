import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {path: "",redirectTo:"login",pathMatch:"full"},
  {path:"login", component: LoginComponent, canActivate: [() => {
    return !localStorage.getItem('token');
  }]},
  {path:"verify", component: VerifyComponent},
  {path: "admin",  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: "chat",  loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
