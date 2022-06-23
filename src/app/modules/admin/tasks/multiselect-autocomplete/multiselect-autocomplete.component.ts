
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { Users } from '../tasks.types';

export interface ItemData {
  item: string;
  selected: boolean;
}
@Component({
  selector: 'multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.scss']
})
export class MultiselectAutocompleteComponent implements OnInit {

  @Output() result = new EventEmitter<Array<Users>>();

  @Input() placeholder: string = 'Select Data';
  @Input() data: Array<Users> = [];
  @Input() boardId: number = 0;
  @Input() key: string = '';


  datatest$ = this._taskService.notAssignedDepartmentUsers$;
  selectControl = new FormControl();

  rawData: Array<Users> = [];
  selectData: Array<Users> = [];

  filteredData: Observable<Array<Users>>;
  filterString: string = '';

  constructor(private _taskService: TasksService) {
    this.filteredData = this.selectControl.valueChanges.pipe(
      startWith<string>(''),
      map(value => typeof value === 'string' ? value : this.filterString),
      map(filter => this.filter(filter)),
      tap(t=>console.log(t)
      )
    );

  }

  ngOnInit(): void {
    this.datatest$.subscribe((res)=>{
      res.forEach((item: Users) => {
        this.rawData.push(item);
      });
    });
  }

  filter = (filter: string): Array<Users> => {
    this.filterString = filter;
    if (filter.length > 0) {
      return this.rawData.filter(option => option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
    } else {
      return this.rawData.slice();
    }
  };

  displayFn = (): string => '';

  optionClicked = (event: Event, data: Users): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: Users): void => {
    data.selected = !data.selected;

    if (data.selected === true) {
      this.selectData.push(data);
      //api assign user to board
        this.assignUserToBoard(data.id);
    } else {
      const i = this.selectData.findIndex(value => value.name === data.name);
      this.selectData.splice(i, 1);
      //api deassign user to board
       this.assignUserToBoard(data.id);

    }

    this.selectControl.setValue(this.selectData);
    this.emitAdjustedData();
  };

  emitAdjustedData = (): void => {
    const results: Array<Users> = [];
    this.selectData.forEach((data: Users) => {
      results.push(data);
    });
    this.result.emit(results);
  };

  removeChip = (data: Users): void => {
    this.toggleSelection(data);
  };


  assignUserToBoard(userId: number){
    this._taskService.assignUserToBoard(this.boardId , userId).subscribe((res)=>{
      console.log(res);
    });
  }

}
