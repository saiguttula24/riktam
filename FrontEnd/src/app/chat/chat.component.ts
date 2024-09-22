import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Groups } from '../models/groups.model';
import { MenuItem } from 'primeng/api/menuitem';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateGroupComponent } from '../shared/create-group/create-group.component';
import { Message } from '../models/message.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State } from '../models/state.model';
import { AddOrEditUserComponent } from '../shared/add-or-edit-user/add-or-edit-user.component';
import { LogoutAction } from '../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  storeSubscription!: Subscription;
  username!: string;
  id!: string;

  constructor(
    private http: HttpService,
    private dialog: DialogService,
    private store: Store,
    private router: Router
  ) { 
    this.http.init();
    this.storeSubscription = this.store.select((store:any) => store.user).subscribe( (user:State) => {
      if(user.users && user.users.length > 0) {
        this.username = user.username;
        this.id = user.id;
        console.log(this.id);
      }
    })
  }

  groups: Groups[] | [] = [];
  items!: MenuItem[];
  chats:any = {}
  messages:Message[] = [];

  ngOnInit(): void {
    this.http.on('connect', () => {
      console.log('Connected to the server');
    });

    this.getGroupsAndChats();

    this.http.on('groupMessage', (data) => {
      this.chats[data.groupId].push(data);
    });

    this.http.on('refreshGroup',(data)=>{
      this.getGroupsAndChats();
    })

    this.http.on('liked',(data)=>{
      const {groupId,messageId,userId} = data;

      this.chats[groupId].forEach((message:Message)=>{
        if(message._id == messageId)message.likes?.push(userId)
      })
    })

    this.http.on('customError',(data)=>{
      console.log(data.message);
    })

    this.http.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

  }

  addParticipants() {
    this.dialog.open(AddOrEditUserComponent,{
      data: {
        group: this.selectedGroup
      },
      header: 'Edit Users',
      width: '30%'
    }).onClose.subscribe((res:any) => {
      if(res) this.getGroupsAndChats();
    });
  }

  deleteGroup() {
    let body = {
      groupId: this.selectedGroup._id.toString()
    }
    this.http.emitWithData("deleteGroup",body,()=>{
      console.log("group deleted");
    })
  }

  exitGroup() {
    let body = {
      groupId: this.selectedGroup._id.toString()
    }
    this.http.emitWithData("exitGroup",body,(res:boolean)=>{
      if(res){
        console.log("Exited from group");
        this.getGroupsAndChats();
      }
    })
  }

  display:boolean = true;

  ngOnDestroy(): void {
    this.http.disconnect();
    if(this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  getGroupsAndChats(){
    this.http.emit("getAllGroups",(response:any)=>{
      this.groups = response;
    })

    this.http.emit("getChat",(response:any)=>{
      this.chats = response;
    })
  }

  openCreateGroupDialog(){
    this.dialog.open(CreateGroupComponent,{
      header: 'Create Group',
      width: '30%'
    }).onClose.subscribe((res:any) => this.getGroupsAndChats());
  }

  selectedGroup!:Groups;
  enteredText!:string;

  onClickGroup(group:Groups){
    console.log(group.createdBy);
    console.log(this.id);
    if(group.createdBy == this.id){
      this.items = [
        {
            label: "Options",
            items: [{
                label: 'Add Participants',
                icon: 'pi pi-user-plus',
                command: () => {
                    this.addParticipants();
                }
            },
            {
                label: 'Delete Group',
                icon: 'pi pi-trash',
                command: () => {
                    this.deleteGroup();
                }
            }
        ]}
      ];
    }else{
      this.items = [
        {
            label: "Options",
            items: [{
                label: 'Exit Group',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.exitGroup();
                }
            },
        ]}
      ];
    }
    this.selectedGroup = group;
    this.messages = this.chats[group._id];
    console.log(this.messages);
  }

  isLiked(likes:any){
    return likes.includes(this.id);
  }

  liked(id:string){
    let body = {
      id:id,
      groupId: this.selectedGroup._id.toString()
    }
    this.http.emitWithData('like',body,(res:boolean)=>{
      if(res){

      }else{

      }
    })
  }

  onClickSendMessage(){
    if(this.enteredText.trim() === "") return;
    let body = {
      groupId : this.selectedGroup._id,
      message: this.enteredText,
    }
    this.enteredText = "";
    this.http.emitWithData("sendMessage",body,(response:Message)=>{
      if(response){
        this.chats[this.selectedGroup._id].push(response);
      }
    })
  }

  onClickLogout(){
    localStorage.clear();
    this.store.dispatch(new LogoutAction());
    this.router.navigate(['/login']);
  }

}
