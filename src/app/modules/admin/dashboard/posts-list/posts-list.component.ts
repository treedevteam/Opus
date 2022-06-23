import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  constructor(private _dashboardService: DashboardService) { }

  ngOnInit(): void {

    this._dashboardService.getPostsDepartment(1).subscribe(res=>{
      console.log(res);
    })

  }

}
