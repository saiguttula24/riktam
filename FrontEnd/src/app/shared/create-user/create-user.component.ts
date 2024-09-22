import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  userCreated:boolean = false;
  password!:string;

  constructor(
    private http: HttpService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.password = this.generatePassword()
    this.createUserForm = new FormGroup({
      username: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl(this.password,[])
    })
    this.createUserForm?.get('password')?.disable();
  }

  generatePassword(): string {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '#?!@$%^&*-';
  
    const password = [
      uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)],
      lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
      ...Array(4).fill(null).map(() => {
        const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
        return allCharacters[Math.floor(Math.random() * allCharacters.length)];
      })
    ].join('');
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  formValues:any;

  onFormSubmit(){
    this.formValues = this.createUserForm.value; 
    console.log(this.formValues);
    const body = {
      username: this.formValues.username,
      email: this.formValues.email,
      password: this.password
    }
    console.log(body);
    this.http.postAuth<{success: boolean, message: string}>(`${environment.api}/auth/createUser`,body).subscribe({
      next: (res: {success: boolean, message: string}) => {
        if(res['success']) {
          this.userCreated = true;
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
