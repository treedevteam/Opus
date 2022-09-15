import { Component, OnInit, Input  } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() color: string;
  apiUrl= environment.apiUrl
  constructor() { }

  ngOnInit(): void {
  }

  wcHexIsLight(color: any): string {
    const hex = color.replace('#', '');
    const cr = parseInt(hex.substr(0, 2), 16);
    const cg = parseInt(hex.substr(2, 2), 16);
    const cb = parseInt(hex.substr(4, 2), 16);
    const brightness = ((cr * 299) + (cg * 587) + (cb * 114)) / 1000;
    if(brightness < 155){
        return 'text-on-primary';
    }else{
        return 'text-on-dark';
    }
}

}
