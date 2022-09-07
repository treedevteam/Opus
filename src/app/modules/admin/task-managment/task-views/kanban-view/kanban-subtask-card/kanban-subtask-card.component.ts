import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Task } from '../../../_models/task';

@Component({
  selector: 'app-kanban-subtask-card',
  templateUrl: './kanban-subtask-card.component.html',
  styleUrls: ['./kanban-subtask-card.component.scss']
})
export class KanbanSubtaskCardComponent implements OnInit {
  @Input() card: Task;
  formShare: FormGroup;
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
}
