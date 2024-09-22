import { Component, Input, OnInit } from '@angular/core';
import { Groups } from 'src/app/models/groups.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() group!: Groups

}
