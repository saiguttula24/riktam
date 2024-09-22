import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './models/state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userData!: State;

  constructor(
    private store: Store
  ){
    this.store.select((store:any) => store?.user).subscribe( (userData:State) => {
      this.userData = userData;
    } )
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event): void {
    if(this.userData) sessionStorage.setItem('applicationState', JSON.stringify(this.userData));
  }

  ngOnInit():void {
    sessionStorage.clear();
  }
}
