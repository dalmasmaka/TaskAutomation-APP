import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectSearchComponent),
      multi: true
    }
  ]
})
export class MultiSelectSearchComponent implements ControlValueAccessor {

  @Input() items: any[] = [];
  @Input() bindLabel: string = 'name';
  @Input() bindValue: string = 'id';
  @Input() placeholder: string = 'Select items';

  searchControl = new FormControl('');
  value: any[] = [];

  filteredItems$: Observable<any[]> = this.searchControl.valueChanges.pipe(
    startWith(''),
    map(value => this.filter(value || ''))
  );

  private filter(search: string): any[] {
    const filterValue = search.toLowerCase();

    return this.items.filter(item =>
      (item[this.bindLabel] || '')
        .toLowerCase()
        .includes(filterValue)
    );
  }

  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(value: any[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateValue(val: any[]) {
    this.value = val;
    this.onChange(val);
  }
}