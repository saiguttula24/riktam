import { Action } from '@ngrx/store';
import { Login } from '../models/login.model';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';

export enum ActionTypes {
    LOGIN = 'LOGIN',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGOUT = 'LOGOUT',
    GET_USERS = 'GET_USERS',
    USERS_SUCCESS = 'USERS_SUCCESS',
    FAILURE = 'FAILURE',
}

export class LoginAction implements Action {
    readonly type: string = ActionTypes.LOGIN;

    constructor(public payload: Login) {}
}

export class LoginSuccessAction implements Action {
    readonly type: string = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: LoginResponse) {}
}

export class GetUsersAction implements Action {
    readonly type: string = ActionTypes.GET_USERS;

    constructor() {}
}

export class UsersSuccessAction implements Action {
    readonly type: string = ActionTypes.USERS_SUCCESS;

    constructor(public payload: User[]) {}
}

export class FailureAction implements Action {
    readonly type: string = ActionTypes.FAILURE;
  
    constructor(public payload: string) {}
}

export class LogoutAction implements Action {
    readonly type: string = ActionTypes.LOGOUT;

    constructor() {}
}

export type UserActionsUnion = LoginAction | LoginSuccessAction | GetUsersAction | FailureAction | LogoutAction | Action;