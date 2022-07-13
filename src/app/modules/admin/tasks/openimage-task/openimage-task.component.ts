import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-openimage-task',
  templateUrl: './openimage-task.component.html',
  styleUrls: ['./openimage-task.component.scss']
})
export class OpenimageTaskComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any) { }

  ngOnInit(): void {
  }

}
