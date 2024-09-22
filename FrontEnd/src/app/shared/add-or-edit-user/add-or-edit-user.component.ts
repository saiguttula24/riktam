import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Groups } from 'src/app/models/groups.model';
import { State } from 'src/app/models/state.model';
import { User } from 'src/app/models/user.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-add-or-edit-user',
  templateUrl: './add-or-edit-user.component.html',
  styleUrls: ['./add-or-edit-user.component.scss']
})
export class AddOrEditUserComponent implements OnInit {

  storeSubscription!: Subscription;
  users:User[] = [];
  selectedUsers: User[] = [];
  group!:Groups;
  id!:string;

  constructor(
    private store: Store,
    public config: DynamicDialogConfig,
    private http: HttpService,
    private dynamicDialogRef: DynamicDialogRef
  ) { 
    this.group =  config.data.group;

  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select((store:any) => store.user).subscribe( (user:State) => {
      if(user.users && user.users.length > 0) {
        this.id = user.id;
        this.users = user.users.filter((user:any)=> user._id.toString() != this.id);
      }
    })
    this.group.members.forEach((userId:string)=>{
      const user:User | undefined = this.users.find((el:any) => el._id.toString() === userId);
      if(user) this.selectedUsers.push(user);
    });
  }


  ngOnDestroy(): void {
    if(this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  onClickConfirm(){
    const members = this.selectedUsers.map((user:any) => user._id.toString());
    let body = {
      groupId: this.group._id.toString(),
      members
    }
    this.http.emitWithData('updateGroupUsers',body,(data:any)=>{
      console.log(data.message);
      if(data){
        this.dynamicDialogRef.close(true);
      }
    })
  }

}
