import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../models/state.model';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {
  
  users: any[] = [];

  constructor(private store: Store<{ user: State }>) {
    this.store.select((store: any) => store.user).subscribe((user: State) => {
      if (user.users && user.users.length > 0) {
        this.users = user.users;
      }
    });
  }

  transform(userId: string, ...args: unknown[]): string | unknown {
    const user = this.users.find((user) => user._id === userId.toString());
    return user ? user.username : 'Unknown User';
  }
}