import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from '../services/http.service';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { State } from '../models/state.model';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  verifyForm!: FormGroup;
  storeSubscription!: Subscription;
  username!: string;
  email!: string;

  constructor(
    private http: HttpService,
    private store: Store,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select((store:any) => store.user).subscribe( (user:State) => {
      if(user.users && user.users.length > 0) {
        this.username = user.username;
        this.email = user.email;
      }
    } )
    this.verifyForm = new FormGroup({
      password: new FormControl('',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]),
      confirmPassword: new FormControl('',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")])
    })
  }

  onFormSubmit(): void {
    let formValues = this.verifyForm.value; 
    const body = {
      username: this.username,
      email: this.email,
      password: formValues.password
    }
    this.http.postAuth<{success: boolean, message: string}>(`${environment.api}/auth/signup`,body).subscribe({
      next: (res: {success: boolean, message: string}) => {
        if(res['success']) {
          this.router.navigate(['/login']);
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
