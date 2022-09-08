import { Component, OnInit, Input  } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User;
  apiUrl= environment.apiUrl
  constructor() { }

  ngOnInit(): void {
    this.user.user_image
  }

}
