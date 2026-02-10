export const APP_INFO = {
  NAME: 'RoomBook',
  FULL_NAME: 'Meeting Room Management',
  TAGLINE: 'Meeting Room Management',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin-dashboard',
  USER_DASHBOARD: '/user-dashboard',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
  UNAUTHENTICATED: 'unauthenticated' as const,
  GUEST: 'Guest',
  ADMINISTRATOR: 'Administrator',
  USER_DISPLAY: 'User',
} as const;

export const ROOM_STATUS = {
  AVAILABLE: 'available' as const,
  UNAVAILABLE: 'unavailable' as const,
  MAINTENANCE: 'maintenance' as const,
  IN_USE: 'In Use',
  UNKNOWN: 'Unknown',
} as const;

export const BOOKING_STATUS = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  CANCELLED: 'cancelled',
} as const;

export const COMMON_AMENITIES: readonly string[] = [
  'Projector',
  'Whiteboard',
  'Video Conference',
  'TV',
  'Phone',
  'WiFi',
] as const;

export const TIME_CONFIG = {
  WORK_DAY_START: 0,
  WORK_DAY_END: 24,
  DEBOUNCE_TIME: 300,
  CAPACITY_DEBOUNCE_TIME: 500,
  MODAL_CLOSE_DELAY: 300,
  DEFAULT_BOOKING_DURATION_HOURS: 1,
  MAX_BOOKING_DAYS_AHEAD: 10,
  MIN_BOOKING_DURATION_MINUTES: 15,
  MAX_BOOKING_DURATION_HOURS: 8,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_CURRENT_PAGE: 1,
  MAX_PAGE_BUTTONS: 7,
  PAGE_RANGE_START: 3,
  PAGE_RANGE_END: 2,
} as const;

export const CAPACITY_CONFIG = {
  MIN_CAPACITY: 1,
  MAX_CAPACITY: 50,
  DEFAULT_MIN: 1,
  DEFAULT_MAX: 50,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  CURRENT_USER: 'currentUser',
} as const;

export const DATE_TIME_FORMATS = {
  LOCALE: 'en-US',
  SHORT_DATE_TIME: {
    month: 'short' as const,
    day: 'numeric' as const,
    year: 'numeric' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  },
  TIME_ONLY: {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    hour12: true as const,
  },
  ISO_DATE_FORMAT: 'YYYY-MM-DD',
} as const;

export const UI_LABELS = {
  LOGIN_HEADER: 'Meeting Room Management',
  LOGIN_WELCOME: 'Welcome to',
  LOGIN_TAGLINE: 'Sign in to manage your meeting rooms.',
  LOGOUT: 'Logout',
  EMAIL_LABEL: 'Email',
  ROLE_LABEL: 'Role',
  NAME_LABEL: 'Name',
  AVAILABLE_ROOMS: 'Available Rooms',
  MY_BOOKINGS: 'My Bookings',
  ALL_BOOKINGS: 'All Bookings',
  TOTAL_ROOMS: 'Total Rooms',
  TOTAL_USERS: 'Total Users',
  ROOMS: 'Rooms',
  USERS: 'Users',
  ROOM_NAME: 'Name',
  ROOM_NUMBER: 'Room Number',
  CAPACITY: 'Capacity',
  FLOOR: 'Floor',
  LOCATION: 'Location',
  AMENITIES: 'Amenities',
  DESCRIPTION: 'Description',
  STATUS: 'Status',
  ACTIONS: 'Actions',
  USER_NAME: 'Name',
  USER_EMAIL: 'Email',
  USER_ROLE: 'Role',
  BOOKING_ID: 'Booking ID',
  USER_NAME_LABEL: 'User Name',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  DURATION: 'Duration',
  PURPOSE: 'Purpose',
  ROOM_SCHEDULE: 'Room Schedule',
  SELECT_DATE: 'Select Date',
  NO_BOOKINGS_TODAY: 'No bookings scheduled for today',
  SEARCH_PLACEHOLDER: 'Search by name or email...',
  SEARCH_USER_PLACEHOLDER: 'Search by user name or room number...',
  SEARCH_ROOMS_PLACEHOLDER: 'Search rooms...',
  STATUS_AVAILABLE: 'Available',
  STATUS_UNAVAILABLE: 'Unavailable',
  STATUS_MAINTENANCE: 'Maintenance',
  STATUS_IN_USE: 'In Use',
  STATUS_COMPLETED: 'Completed',
  STATUS_ACTIVE: 'Active',
  STATUS_UPCOMING: 'Upcoming',
  LOADING: 'Loading',
  LOADING_DOTS: 'Loading...',
  SUBMITTING: 'Submitting...',
  SAVING: 'Saving...',
  ELLIPSIS: '...',
  OF: 'of',
  MIN: 'min',
} as const;

export const BUTTON_LABELS = {
  LOG_IN: 'Log In',
  LOGGING_IN: 'Logging in...',
  ADD: 'Add',
  ADD_USER: '+ Add User',
  ADD_ROOM: '+ Add Room',
  EDIT: 'Edit',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  SUBMIT: 'Submit',
  UPDATE: 'Update',
  BOOK_NOW: 'Book Now',
  BOOK: 'Book',
  VIEW_SCHEDULE: 'View Schedule',
  CANCEL_BOOKING: 'Cancel',
  SHOW_FILTERS: 'Show Filters',
  HIDE_FILTERS: 'Hide Filters',
  CLEAR_FILTERS: 'Clear Filters',
  CLEAR_SEARCH: 'Clear Search',
  APPLY_FILTERS: 'Apply Filters',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  GO_TO_HOME: 'Go to Home',
  GO_TO_LOGIN: 'Go to Login',
} as const;

export const FORM_LABELS = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  ROLE: 'Role',
  ROOM_NAME: 'Room Name',
  ROOM_NUMBER: 'Room Number',
  CAPACITY: 'Capacity',
  FLOOR: 'Floor',
  AMENITIES: 'Amenities',
  LOCATION: 'Location',
  DESCRIPTION: 'Description',
  STATUS: 'Status',
  START_DATE_TIME: 'Start Date & Time',
  END_DATE_TIME: 'End Date & Time',
  PURPOSE: 'Purpose',
  SEARCH: 'Search',
  MIN_CAPACITY: 'Min Capacity',
  MAX_CAPACITY: 'Max Capacity',
  FLOOR_FILTER: 'Floor',
  AMENITIES_FILTER: 'Amenities',
} as const;

export const PLACEHOLDERS = {
  ENTER_EMAIL: 'Enter Email',
  ENTER_PASSWORD: 'Enter your password',
  ENTER_FIRST_NAME: 'Enter first name',
  ENTER_LAST_NAME: 'Enter last name',
  ENTER_ROOM_NAME: 'Enter room name',
  ENTER_ROOM_NUMBER: 'Enter room number',
  ENTER_CAPACITY: 'Enter capacity',
  ENTER_FLOOR: 'Enter floor number',
  ENTER_AMENITIES: 'e.g., Projector, Whiteboard, WiFi',
  ENTER_LOCATION: 'Enter location',
  ENTER_DESCRIPTION: 'Enter description (optional)',
  ENTER_PURPOSE: 'Enter purpose of booking',
  SELECT_START_TIME: 'Select start date and time',
  SELECT_END_TIME: 'Select end date and time',
  SEARCH_ROOMS: 'Search rooms by name, location, or amenities...',
  SEARCH_USERS: 'Search by name or email...',
  SEARCH_BOOKINGS: 'Search by user name or room number...',
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  EMAIL_MAX_LENGTH: 'Email cannot exceed 254 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MAX_LENGTH: 'Password cannot exceed 128 characters',
  NAME_REQUIRED: 'Name is required',
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',
  NAME_MAX_LENGTH: 'Name cannot exceed 50 characters',
  ROOM_NAME_REQUIRED: 'Room name is required',
  ROOM_NAME_MIN_LENGTH: 'Room name must be at least 3 characters',
  ROOM_NAME_MAX_LENGTH: 'Room name cannot exceed 100 characters',
  ROOM_NUMBER_REQUIRED: 'Room number is required',
  ROOM_NUMBER_MIN: 'Room number must be at least 1',
  ROOM_NUMBER_MAX: 'Room number cannot exceed 9999',
  CAPACITY_REQUIRED: 'Capacity is required',
  CAPACITY_MIN: 'Capacity must be at least 1',
  CAPACITY_MAX: 'Capacity cannot exceed 500',
  FLOOR_REQUIRED: 'Floor is required',
  FLOOR_MIN: 'Floor must be at least 1',
  FLOOR_MAX: 'Floor cannot exceed 100',
  AMENITIES_REQUIRED: 'Amenities are required',
  AMENITIES_MAX_LENGTH: 'Amenities cannot exceed 500 characters',
  LOCATION_REQUIRED: 'Location is required',
  LOCATION_MAX_LENGTH: 'Location cannot exceed 200 characters',
  DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 1000 characters',
  STATUS_REQUIRED: 'Status is required',
  START_DATE_TIME_REQUIRED: 'Start date and time is required',
  END_DATE_TIME_REQUIRED: 'End date and time is required',
  PURPOSE_REQUIRED: 'Purpose is required',
  PURPOSE_MIN_LENGTH: 'Purpose must be at least 5 characters',
  PURPOSE_MAX_LENGTH: 'Purpose cannot exceed 500 characters',
  PAST_BOOKING_ERROR: 'Cannot book a room in the past',
  END_BEFORE_START_ERROR: 'End time must be after start time',
  BOOKING_TOO_SHORT: 'Booking must be at least 15 minutes',
  BOOKING_TOO_LONG: 'Booking cannot exceed 8 hours',
  FIELD_REQUIRED: 'This field is required',
  MIN_LENGTH_ERROR: (min: number) => `Must be at least ${min} characters`,
  MIN_VALUE_ERROR: (min: number) => `Must be at least ${min}`,
  MAX_LENGTH_ERROR: (max: number) => `Cannot exceed ${max} characters`,
  MAX_VALUE_ERROR: (max: number) => `Cannot exceed ${max}`,
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  USER_ADDED: 'User added successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  ROOM_ADDED: 'Room added successfully',
  ROOM_UPDATED: 'Room updated successfully',
  ROOM_DELETED: 'Room deleted successfully',
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_DELETED: 'Booking deleted successfully',
} as const;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  LOGOUT_FAILED: 'Logout failed. Please try again.',
  USER_ADD_FAILED: 'Failed to add user. Please try again.',
  USER_UPDATE_FAILED: 'Failed to update user. Please try again.',
  USER_DELETE_FAILED: 'Failed to delete user. Please try again.',
  USER_FETCH_FAILED: 'Failed to fetch users. Please try again.',
  ROOM_ADD_FAILED: 'Failed to add room. Please try again.',
  ROOM_UPDATE_FAILED: 'Failed to update room. Please try again.',
  ROOM_DELETE_FAILED: 'Failed to delete room. Please try again.',
  ROOM_FETCH_FAILED: 'Failed to fetch rooms. Please try again.',
  BOOKING_CREATE_FAILED: 'Failed to create booking. Please try again.',
  BOOKING_CANCEL_FAILED: 'Failed to cancel booking. Please try again.',
  BOOKING_DELETE_FAILED: 'Failed to delete booking. Please try again.',
  BOOKING_FETCH_FAILED: 'Failed to fetch bookings. Please try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

export const CONFIRMATION_MESSAGES = {
  DELETE_USER: (name: string) => `Are you sure you want to delete ${name}?`,
  DELETE_ROOM: (name: string) => `Are you sure you want to delete ${name}?`,
  CANCEL_BOOKING: (purpose: string) => `Are you sure you want to cancel this booking: "${purpose}"?`,
  DELETE_BOOKING: (purpose: string) => `Are you sure you want to delete this booking: "${purpose}"? This action cannot be undone.`,
} as const;

export const DIALOG_HEADERS = {
  DELETE_CONFIRMATION: 'Delete Confirmation',
  CANCEL_BOOKING: 'Cancel Booking',
  DELETE_BOOKING: 'Delete Booking',
  ADD_USER: 'Add User',
  EDIT_USER: 'Edit User',
  ADD_ROOM: 'Add Room',
  EDIT_ROOM: 'Edit Room',
  BOOK_ROOM: 'Book Room',
  ROOM_SCHEDULE: 'Room Schedule',
} as const;

export const NO_DATA_MESSAGES = {
  NO_USERS: 'No users available',
  NO_USERS_FOUND: (query: string) => `No users found matching "${query}"`,
  NO_ROOMS: 'No rooms available',
  NO_ROOMS_FOUND: (query: string) => `No rooms found matching "${query}"`,
  NO_BOOKINGS: 'No bookings found',
  NO_BOOKINGS_FOUND: (query: string) => `No bookings found matching "${query}"`,
  NO_DATA: 'No data available',
} as const;

export const INFO_MESSAGES = {
  LOADING_BOOKINGS: 'Loading bookings...',
  LOADING_ROOMS: 'Loading rooms...',
  LOADING_USERS: 'Loading users...',
  LOADING_DATA: 'Loading data...',
  USERS_COUNT: (filtered: number, total: number) => `${filtered} of ${total} users`,
  ROOMS_COUNT: (total: number) => `${total} rooms total`,
  BOOKINGS_COUNT: (filtered: number, total: number) => `${filtered} of ${total} bookings`,
  DURATION_MINUTES: (minutes: number) => `${minutes} min`,
} as const;

export const TOAST_SEVERITY = {
  SUCCESS: 'success' as const,
  INFO: 'info' as const,
  WARN: 'warn' as const,
  ERROR: 'error' as const,
} as const;

export const TOAST_SUMMARY = {
  SUCCESS: 'Success',
  INFO: 'Info',
  WARNING: 'Warning',
  ERROR: 'Error',
} as const;

export const ICONS = {
  BOOK: 'fa-solid fa-book',
  HOME: 'pi pi-home',
  CALENDAR: 'pi pi-calendar',
  CALENDAR_TIMES: 'pi pi-calendar-times',
  EDIT: 'fa fa-edit',
  DELETE: 'fa fa-trash',
  SEARCH: 'fa fa-search',
  TIMES: 'pi pi-times',
  TRASH: 'pi pi-trash',
  SPINNER: 'pi pi-spinner pi-spin',
  EXCLAMATION: 'pi pi-exclamation-triangle',
  DOOR_CLOSED: 'fa-solid fa-door-closed',
  USER: 'fa-solid fa-user',
  USER_SHIELD: 'fa-solid fa-user-shield',
  ID_CARD: 'fa-solid fa-id-card',
  ENVELOPE: 'fa-solid fa-envelope',
  LOGOUT_ICON: 'fa-solid fa-right-from-bracket',
  CHEVRON_DOWN: 'fa-solid fa-chevron-down',
  CHEVRON_LEFT: 'fa fa-chevron-left',
  CHEVRON_RIGHT: 'fa fa-chevron-right',
} as const;

export const CSS_CLASSES = {
  ACTIVE: 'active',
  ADMIN: 'admin',
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  MAINTENANCE: 'maintenance',
  COMPLETED: 'completed',
  UPCOMING: 'upcoming',
  ACTIVE_STATUS: 'active',
  ERROR_MESSAGE: 'error-message',
  NO_DATA: 'no-data',
} as const;

export const FORM_CONTROLS = {
  EMAIL: 'email',
  PASSWORD: 'password',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  NAME: 'name',
  ROLE: 'role',
  ROOM_NAME: 'name',
  ROOM_NUMBER: 'roomNumber',
  CAPACITY: 'capacity',
  FLOOR: 'floor',
  AMENITIES: 'amenities',
  LOCATION: 'location',
  DESCRIPTION: 'description',
  STATUS: 'status',
  START_DATE_TIME: 'startDateTime',
  END_DATE_TIME: 'endDateTime',
  PURPOSE: 'purpose',
  SEARCH_TEXT: 'searchText',
  MIN_CAPACITY: 'minCapacity',
  MAX_CAPACITY: 'maxCapacity',
} as const;

export const TABLE_HEADERS = {
  NAME: 'Name',
  EMAIL: 'Email',
  ROLE: 'Role',
  ACTIONS: 'Actions',
  ROOM_NUMBER: 'Room Number',
  CAPACITY: 'Capacity',
  FLOOR: 'Floor',
  LOCATION: 'Location',
  AMENITIES: 'Amenities',
  DESCRIPTION: 'Description',
  STATUS: 'Status',
  BOOKING_ID: 'Booking ID',
  USER_NAME: 'User Name',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  DURATION: 'Duration',
  PURPOSE: 'Purpose',
} as const;

export const DEFAULT_INITIALS = '?';

export const DEFAULT_VALUES = {
  USER_ROLE: 'user' as const,
  ROOM_STATUS: 'available' as const,
  EMPTY_STRING: '',
  NOT_AVAILABLE: 'N/A',
  USER_DEFAULT: 'User',
  QUESTION_MARK: '?',
} as const;
