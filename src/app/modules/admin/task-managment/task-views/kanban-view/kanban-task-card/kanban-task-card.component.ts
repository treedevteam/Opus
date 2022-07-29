import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Task } from '../../../_models/task';

@Component({
  selector: 'app-kanban-task-card',
  templateUrl: './kanban-task-card.component.html',
  styleUrls: ['./kanban-task-card.component.scss']
})
export class KanbanTaskCardComponent implements OnInit {
  @Input() card: Task;
  formShare: FormGroup;
  expandedSubtasks = null

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formShare = this._formBuilder.group({
      boards: ['', Validators.required],
  });
  }

  isOverdue(date: string): boolean
    {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

  sahreTaskPopover(){

  }

  onSubmit(id:number){

  }
  toggleTableRows(id:number){

  }
}
