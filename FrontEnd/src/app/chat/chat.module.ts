import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import {SidebarModule} from 'primeng/sidebar';
import {DividerModule} from 'primeng/divider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { GroupComponent } from './group/group.component';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from 'primeng/menu';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';


@NgModule({
  declarations: [
    ChatComponent,
    GroupComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SplitButtonModule,
    DividerModule,
    SidebarModule,
    PanelModule,
    MenuModule,
    InputTextareaModule,
    FormsModule,
    SharedModule,
    OverlayPanelModule
  ]
})
export class ChatModule { }
