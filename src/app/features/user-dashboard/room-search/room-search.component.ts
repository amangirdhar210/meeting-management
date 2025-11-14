import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RoomSearchParams } from '../../../shared/models/api.model';

@Component({
  selector: 'app-room-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './room-search.component.html',
  styleUrl: './room-search.component.scss',
})
export class RoomSearchComponent {
  @Output() search = new EventEmitter<RoomSearchParams>();

  showFilters = signal<boolean>(false);

  searchForm = new FormGroup({
    minCapacity: new FormControl<number | null>(null),
    maxCapacity: new FormControl<number | null>(null),
    floor: new FormControl<number | null>(null),
    amenities: new FormControl<string>(''),
  });

  commonAmenities = [
    'Projector',
    'Whiteboard',
    'Video Conference',
    'TV',
    'Phone',
    'WiFi',
  ];

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    const params: RoomSearchParams = {};

    if (formValue.minCapacity) params.minCapacity = formValue.minCapacity;
    if (formValue.maxCapacity) params.maxCapacity = formValue.maxCapacity;
    if (formValue.floor) params.floor = formValue.floor;
    if (formValue.amenities) params.amenities = formValue.amenities;

    this.search.emit(params);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.search.emit({});
  }

  toggleAmenity(amenity: string): void {
    const current = this.searchForm.value.amenities || '';
    const amenities = current
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a);

    if (amenities.includes(amenity)) {
      const filtered = amenities.filter((a) => a !== amenity);
      this.searchForm.patchValue({ amenities: filtered.join(',') });
    } else {
      amenities.push(amenity);
      this.searchForm.patchValue({ amenities: amenities.join(',') });
    }

    this.onSearch();
  }

  isAmenitySelected(amenity: string): boolean {
    const current = this.searchForm.value.amenities || '';
    return current
      .split(',')
      .map((a) => a.trim())
      .includes(amenity);
  }
}
