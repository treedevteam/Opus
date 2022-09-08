import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-popup',
  templateUrl: './file-popup.component.html',
  styleUrls: ['./file-popup.component.scss']
})
export class FilePopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any) { }


  ngOnInit(): void {
  }

}
