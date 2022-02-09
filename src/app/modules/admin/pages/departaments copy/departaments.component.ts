import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-departaments',
  templateUrl: './departaments.component.html',
  styleUrls: ['./departaments.component.scss']
})
export class DepartamentsComponent implements OnInit {
    formFieldHelpers: string[] = [''];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }


  getFormFieldHelpersAsString(): string
    {
        return this.formFieldHelpers.join(' ');
    }

}
