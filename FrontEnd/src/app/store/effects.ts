import { Injectable } from "@angular/core";
import { createEffect, ofType } from "@ngrx/effects";
import { Actions } from  "@ngrx/effects"
import { ActionTypes, LoginAction, FailureAction, LoginSuccessAction, UsersSuccessAction, GetUsersAction } from "./actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { HttpService } from "../services/http.service";
import { LoginResponse } from "src/app/models/login-response.model";
import { environment } from "src/environments/environment.prod";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersResponse } from "../models/users-response.model";

@Injectable()

export class UserEffects {
    login = createEffect( () => {
        return this.actions.pipe(
            ofType(ActionTypes.LOGIN),
            switchMap((login: LoginAction) => {
                const body = {
                    email: login.payload.email,
                    password: login.payload.password 
                }
                return this.http.post<LoginResponse>(`${environment.api}/auth/login`,body)
                .pipe(
                    mergeMap( (res: LoginResponse) => {
                    if(res['success'] && res['token']){
                        localStorage.setItem('token',res['token']);
                        if(res['user'].isAdmin){
                            this.router.navigate(['/admin']);
                        }else{
                            if(res['user'].isVerified){
                                this.router.navigate(['/chat']);
                            }else{
                                this.router.navigate(['/verify']);
                            }
                        }
                    }else{
                        this.messageService.add({severity:'error',summary:'Error', detail: res['message']});
                        return [new FailureAction(res['message'])]
                    }
                    return [new LoginSuccessAction(res),new GetUsersAction()];
                  }),
                  catchError( (err: HttpErrorResponse) => {
                    this.messageService.add({severity:'error',summary:'Error', detail: err?.error['message']});
                    return of(new FailureAction(err.error['message']));
                  })
                )
            })
        )
    } )

    users = createEffect( () => {
        return this.actions.pipe(
            ofType(ActionTypes.GET_USERS),
            switchMap(() => {
                return this.http.getAuth<UsersResponse>(`${environment.api}/users`)
                .pipe(
                    map( (res: UsersResponse): UsersResponse => {
                        if(!res['success'] || !res['users']){
                            this.messageService.add({severity:'error',summary:'Error', detail: res['message']});
                        }
                        return res;
                    }),
                    map( (res: UsersResponse) => {
                      if(res['users']) {
                          return new UsersSuccessAction(res['users']);
                      }
                      else return new FailureAction(res['message']? res['message'] : 'Unkown Error Occured');
                    }),
                    catchError( (err: HttpErrorResponse) => {
                      this.messageService.add({severity:'error',summary:'Error', detail: err?.error['message']});
                      return of(new FailureAction(err.error['message']));
                    })
                  )
            })
        )
    } )

    constructor(private actions: Actions, private http: HttpService, private messageService: MessageService, private router: Router) {}
}