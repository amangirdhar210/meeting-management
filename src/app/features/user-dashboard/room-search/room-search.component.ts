import {
  Component,
  inject,
  signal,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { RoomSearchParams } from '../../../shared/models/api.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-room-search',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SliderModule],
  templateUrl: './room-search.component.html',
  styleUrl: './room-search.component.scss',
})
export class RoomSearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<RoomSearchParams>();

  showFilters = signal<boolean>(false);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<void>();
  private capacityChangeSubject$ = new Subject<number[]>();

  capacityRange = signal<number[]>([1, 50]);
  capacityRangeValue: number[] = [1, 50];

  searchForm = new FormGroup({
    searchText: new FormControl<string>(''),
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

  ngOnInit(): void {
    this.searchSubject$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.performSearch();
      });

    this.capacityChangeSubject$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((values) => {
        this.capacityRange.set(values);
        this.performSearch();
      });

    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.performSearch();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  onSearch(): void {
    this.searchSubject$.next();
  }

  performSearch(): void {
    const formValue = this.searchForm.value;
    const params: RoomSearchParams = {};

    if (formValue.searchText && formValue.searchText.trim()) {
      params.searchText = formValue.searchText.trim();
    }

    const [min, max] = this.capacityRange();
    if (min > 1 || max < 50) {
      params.minCapacity = min;
      params.maxCapacity = max;
    }

    if (formValue.floor) params.floor = formValue.floor;
    if (formValue.amenities) params.amenities = formValue.amenities;

    this.search.emit(params);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.capacityRange.set([1, 50]);
    this.capacityRangeValue = [1, 50];
    this.search.emit({});
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchText: '' });
    this.performSearch();
  }

  onCapacityChange(event: any): void {
    const values = event.values || this.capacityRangeValue;
    if (values && Array.isArray(values) && values.length === 2) {
      this.capacityRangeValue = [...values];
      this.capacityChangeSubject$.next(values);
    }
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

    this.performSearch();
  }

  isAmenitySelected(amenity: string): boolean {
    const current = this.searchForm.value.amenities || '';
    return current
      .split(',')
      .map((a) => a.trim())
      .includes(amenity);
  }
}
