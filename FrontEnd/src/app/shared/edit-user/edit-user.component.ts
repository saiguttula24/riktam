import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  user!: User;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.user = config.data.user;
   }

  ngOnInit(): void {
    this.editUserForm = new FormGroup({
      username: new FormControl(this.user.username,[Validators.required]),
      email: new FormControl(this.user.email,[Validators.required,Validators.email]),
    })
  }

  onFormSubmit(){

  }

}
