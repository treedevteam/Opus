import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-store-reply',
  templateUrl: './store-reply.component.html',
  styleUrls: ['./store-reply.component.scss']
})
export class StoreReplyComponent implements OnInit {
  @Input() postId: number;
  replyForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.replyForm = this._formBuilder.group({
      text: "",
    });
  }

  storeReplyPost(){
    const formData = new FormData();
        const result = Object.assign({}, this.replyForm.value);
        formData.append(
            'text',
            this.replyForm.get('text').value
        );
    this._dashboardService.storeReply(this.postId, formData).subscribe(res=>{
      console.log(res);
    })
    
  }



}
