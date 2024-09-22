import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { State } from 'src/app/models/state.model';
import { User } from 'src/app/models/user.model';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  createGroupForm!: FormGroup;
  formValues: any;
  storeSubscription!: Subscription;
  users:User[] | [] = [];
  selectedUsers: User[] | [] = [];
  id!: string;

  constructor(
    private http: HttpService,
    private store: Store,
    private messageService: MessageService,
    private dynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.createGroupForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required])
    })
    this.storeSubscription = this.store.select((store:any) => store.user).subscribe( (user:State) => {
      if(user.users && user.users.length > 0) {
        this.id = user.id;
        this.users = user.users.filter((user:any)=> user._id.toString() != this.id);
      }
    } )
  }

  userAction(e:any){
    this.selectedUsers = e.value.map((user:any)=>user._id);
    console.log(this.selectedUsers);
  }

  onFormSubmit() {
    this.formValues = this.createGroupForm.value; 
    const body = {
      name: this.formValues.name,
      description: this.formValues.description,
      members: this.selectedUsers
    }
    console.log(body);
    this.http.postAuth<{success: boolean, message: string,groupId: string}>(`${environment.api}/groups/createGroup`,body).subscribe({
      next: (res: {success: boolean, message: string, groupId: string}) => {
        if(res['success']) {
          this.messageService.add({severity:'success',summary:'Success', detail: res['message']});
          this.http.emitWithData('newGroupCreated',{groupId:res['groupId']},()=>console.log("new group created"));
          this.dynamicDialogRef.close();
        }else {
          this.messageService.add({severity:'error',summary:'Error', detail: res['message']});
        }
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({severity:'error',summary:'Error', detail: err?.error['message']});
      },
      complete: () => {
        console.log('call completed');
      }
    })
  }

}
