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
  Validators,
} from '@angular/forms';
import { RoomSearchParams } from '../../../shared/models/api.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SliderModule, SliderChangeEvent } from 'primeng/slider';
import { 
  TIME_CONFIG, 
  CAPACITY_CONFIG, 
  COMMON_AMENITIES, 
  BUTTON_LABELS, 
  FORM_LABELS 
} from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-room-search',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SliderModule],
  templateUrl: './room-search.component.html',
  styleUrl: './room-search.component.scss',
})
export class RoomSearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<RoomSearchParams>();

  readonly BUTTONS = BUTTON_LABELS;
  readonly LABELS = FORM_LABELS;
  readonly COMMON_AMENITIES = COMMON_AMENITIES;

  showFilters = signal<boolean>(false);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<void>();
  private capacityChangeSubject$ = new Subject<number[]>();

  capacityRange = signal<number[]>([CAPACITY_CONFIG.MIN_CAPACITY, CAPACITY_CONFIG.MAX_CAPACITY]);
  capacityRangeValue: number[] = [CAPACITY_CONFIG.MIN_CAPACITY, CAPACITY_CONFIG.MAX_CAPACITY];

  searchForm = new FormGroup({
    searchText: new FormControl<string>('', {
      validators: [Validators.maxLength(200)]
    }),
    floor: new FormControl<number | null>(null, {
      validators: [Validators.min(1), Validators.max(100)]
    }),
    amenities: new FormControl<string>('', {
      validators: [Validators.maxLength(500)]
    }),
  });

  ngOnInit(): void {
    this.searchSubject$
      .pipe(debounceTime(TIME_CONFIG.DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe(() => {
        this.performSearch();
      });

    this.capacityChangeSubject$
      .pipe(debounceTime(TIME_CONFIG.CAPACITY_DEBOUNCE_TIME), takeUntil(this.destroy$))
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
    if (min > CAPACITY_CONFIG.MIN_CAPACITY || max < CAPACITY_CONFIG.MAX_CAPACITY) {
      params.minCapacity = min;
      params.maxCapacity = max;
    }

    if (formValue.floor) params.floor = formValue.floor;
    if (formValue.amenities) params.amenities = formValue.amenities;

    this.search.emit(params);
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.capacityRange.set([CAPACITY_CONFIG.MIN_CAPACITY, CAPACITY_CONFIG.MAX_CAPACITY]);
    this.capacityRangeValue = [CAPACITY_CONFIG.MIN_CAPACITY, CAPACITY_CONFIG.MAX_CAPACITY];
    this.search.emit({});
  }

  clearSearch(): void {
    this.searchForm.patchValue({ searchText: '' });
    this.performSearch();
  }

  onCapacityChange(event: SliderChangeEvent): void {
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
