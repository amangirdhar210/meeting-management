export const LoginPageSelectors = {
  emailInput: '//input[@id="email"]',
  passwordInput: '//input[@id="password"]',
  submitButton: '//button[@type="submit"]',
  brandLogo: '//img[@alt="Meetrix Logo"]',
  welcomeMessage: '//div[@class="welcome-message"]',
  loginForm: '//form[@class="login-form"]',
  emailError: '//input[@id="email"]/following-sibling::div//small[@class="error-message"]',
  passwordError: '//input[@id="password"]/following-sibling::div//small[@class="error-message"]',
};

export const DashboardSelectors = {
  appHeader: '//app-header',
  headerTitle: '//app-header//h2',
  logoImage: '//app-header//img[@alt="Logo"]',
  logoutButton: '//button[@class="logout-btn"]',
  userInfo: '//div[@class="user-info"]',
  userAvatar: '//div[@class="avatar"]',
  statsCards: '//app-stats-card',
  totalRoomsCard: '//app-stats-card[contains(., "Total Rooms")]',
  availableRoomsCard: '//app-stats-card[contains(., "Available Rooms")]',
  totalUsersCard: '//app-stats-card[contains(., "Total Users")]',
  dashboardContainer: '//div[@class="dashboard-container"]',
};

export const AdminDashboardSelectors = {
  roomsTab: '//div[@class="toggle-buttons"]//button[contains(., "Rooms")]',
  usersTab: '//div[@class="toggle-buttons"]//button[contains(., "Users")]',
  allBookingsTab: '//div[@class="toggle-buttons"]//button[contains(., "All Bookings")]',
  activeTab: '//div[@class="toggle-buttons"]//button[contains(@class, "active")]',
  
  addUserButton: '//button[contains(text(), "Add User")]',
  userTable: '//table[contains(@class, "user-table")]',
  userTableRows: '//table[contains(@class, "user-table")]//tbody/tr',
  editUserButton: '//button[@title="Edit User"]',
  deleteUserButton: '//button[@title="Delete User"]',
  
  addRoomButton: '//button[contains(text(), "Add Room")]',
  roomTable: '//table[contains(@class, "room-table")]',
  roomTableRows: '//table[contains(@class, "room-table")]//tbody/tr',
  editRoomButton: '//button[@title="Edit Room"]',
  deleteRoomButton: '//button[@title="Delete Room"]',
  
  bookingsTable: '//table[contains(@class, "bookings-table")]',
  bookingsTableRows: '//table[contains(@class, "bookings-table")]//tbody/tr',
  cancelBookingButton: '//button[@title="Cancel Booking"]',
  
  statusFilter: '//select[@name="status"]',
  dateFilter: '//input[@type="date"]',
  searchInput: '//input[@placeholder="Search"]',
};

export const UserDashboardSelectors = {
  availableRoomsButton: '//button[@class="view-toggle-btn" and contains(., "Available Rooms")]',
  myBookingsButton: '//button[@class="view-toggle-btn" and contains(., "My Bookings")]',
  activeViewButton: '//button[contains(@class, "view-toggle-btn") and contains(@class, "active")]',
  
  searchRoomInput: '//input[@placeholder="Search rooms"]',
  capacityFilter: '//select[@name="capacity"]',
  floorFilter: '//select[@name="floor"]',
  amenitiesFilter: '//select[@name="amenities"]',
  searchButton: '//button[contains(text(), "Search")]',
  roomCards: '//div[contains(@class, "room-card")]',
  viewScheduleButton: '//button[contains(text(), "View Schedule")]',
  bookNowButton: '//button[contains(text(), "Book Now")]',
  
  myBookingsCards: '//div[contains(@class, "booking-card")]',
  upcomingBookingsSection: '//section[contains(@class, "upcoming-bookings")]',
  pastBookingsSection: '//section[contains(@class, "past-bookings")]',
  cancelMyBookingButton: '//button[contains(text(), "Cancel")]',
  viewDetailsButton: '//button[contains(text(), "View Details")]',
};

export const BookingFormSelectors = {
  formHeader: '//h3[contains(text(), "Book a Room")]',
  
  roomDropdown: '//select[@formcontrolname="roomId"]',
  dateInput: '//input[@formcontrolname="date"]',
  startTimeInput: '//input[@formcontrolname="startTime"]',
  endTimeInput: '//input[@formcontrolname="endTime"]',
  purposeInput: '//textarea[@formcontrolname="purpose"]',
  attendeesInput: '//input[@formcontrolname="attendees"]',
  
  submitBookingButton: '//button[@type="submit" and contains(text(), "Book")]',
  cancelButton: '//button[contains(text(), "Cancel")]',
  checkAvailabilityButton: '//button[contains(text(), "Check Availability")]',
  
  roomError: '//select[@formcontrolname="roomId"]/following-sibling::small',
  dateError: '//input[@formcontrolname="date"]/following-sibling::small',
  timeError: '//small[contains(@class, "time-error")]',
  purposeError: '//textarea[@formcontrolname="purpose"]/following-sibling::small',
};

export const RoomScheduleModalSelectors = {
  modalContainer: '//div[contains(@class, "schedule-modal")]',
  modalHeader: '//div[contains(@class, "schedule-modal")]//h3',
  closeButton: '//button[@aria-label="Close Modal"]',
  
  timelineView: '//div[contains(@class, "timeline-view")]',
  bookingBars: '//div[contains(@class, "booking-bar")]',
  timeSlots: '//div[contains(@class, "time-slot")]',
  
  roomNameDisplay: '//span[contains(@class, "room-name")]',
  roomCapacityDisplay: '//span[contains(@class, "room-capacity")]',
  roomFloorDisplay: '//span[contains(@class, "room-floor")]',
  
  previousDayButton: '//button[@title="Previous Day"]',
  nextDayButton: '//button[@title="Next Day"]',
  currentDateDisplay: '//span[contains(@class, "current-date")]',
};

export const CommonSelectors = {
  toastContainer: '//div[contains(@class, "p-toast")]',
  successToast: '//div[contains(@class, "p-toast-message-success")]',
  errorToast: '//div[contains(@class, "p-toast-message-error")]',
  warningToast: '//div[contains(@class, "p-toast-message-warn")]',
  infoToast: '//div[contains(@class, "p-toast-message-info")]',
  
  confirmDialog: '//div[contains(@class, "p-confirm-dialog")]',
  confirmYesButton: '//button[contains(@class, "p-confirm-dialog-accept")]',
  confirmNoButton: '//button[contains(@class, "p-confirm-dialog-reject")]',
  
  loadingSpinner: '//div[contains(@class, "loading-spinner")]',
  progressBar: '//div[contains(@class, "p-progressbar")]',
  
  saveButton: '//button[contains(text(), "Save")]',
  cancelButton: '//button[contains(text(), "Cancel")]',
  deleteButton: '//button[contains(text(), "Delete")]',
  editButton: '//button[contains(text(), "Edit")]',
};

export default {
  LoginPageSelectors,
  DashboardSelectors,
  AdminDashboardSelectors,
  UserDashboardSelectors,
  BookingFormSelectors,
  RoomScheduleModalSelectors,
  CommonSelectors,
};
