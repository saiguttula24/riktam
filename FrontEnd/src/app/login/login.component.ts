import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginAction } from '../store/actions';
import { Login } from '../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  storeSubscription!: Subscription;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")])
    })
  }

  onFormSubmit(): void {
    const formValues : Login = this.loginForm.value;
    this.store.dispatch(new LoginAction(formValues) );
  }

  ngOnDestroy(): void {
    if(this.storeSubscription) this.storeSubscription.unsubscribe();
  }

}
