import { State } from "../models/state.model";
import { User } from "../models/user.model";
import { ActionTypes, LoginSuccessAction,  UserActionsUnion, UsersSuccessAction } from "./actions";

export const initialUserState: State = {
    username: '',
    email: '',
    id: '',
    isAdmin: false,
    isVerified: false,
    users: []
}

function _UserReducer(state:State, action: UserActionsUnion) {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                username: (action as LoginSuccessAction).payload.user.username,
                email: (action as LoginSuccessAction).payload.user.email,
                id: (action as LoginSuccessAction).payload.user.id,
                isAdmin: (action as LoginSuccessAction).payload.user.isAdmin,
                isVerified: (action as LoginSuccessAction).payload.user.isVerified
            }
        case ActionTypes.USERS_SUCCESS:
            return {
                ...state,
                users: [...(action as UsersSuccessAction).payload]
            }
        case ActionTypes.LOGOUT:
            return initialUserState;
        default:
            return state;
    }
}

export function UserReducer(state = initialUserState, action: UserActionsUnion) {
    const storedState = sessionStorage.getItem('applicationState');
    if (storedState != null) {
      state = JSON.parse(storedState);
    }
    return _UserReducer(state, action);
}