import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { State } from '../models/state.model';
import { DialogService } from 'primeng/dynamicdialog';
import { EditUserComponent } from '../shared/edit-user/edit-user.component';
import { CreateUserComponent } from '../shared/create-user/create-user.component';
import { LogoutAction } from '../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  storeSubscription!: Subscription;

  constructor(
    private store: Store,
    private dialog: DialogService,
    private router: Router
  ) { }

  users:User[] | [] = [];

  ngOnInit(): void {
    this.storeSubscription = this.store.select((store:any) => store.user).subscribe( (user:State) => {
      if(user.users && user.users.length > 0) {
        this.users = user.users;
      }
    } )
  }

  onClickEditUser(user:User){
    this.dialog.open(EditUserComponent,{
      data: {
        user
      },
      header: 'Edit User',
      width: '30%'
    })
  }

  onClickCreateUser(){
    this.dialog.open(CreateUserComponent,{
      header: 'Create User',
      width: '30%'
    })
  }

  ngOnDestroy(): void {
    if(this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  onClickLogout(){
    localStorage.clear();
    this.store.dispatch(new LogoutAction());
    this.router.navigate(['/login']);
  }


}
