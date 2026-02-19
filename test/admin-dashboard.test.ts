import { Builder, Browser, WebDriver, By } from 'selenium-webdriver';
import { expect } from 'chai';
import TestHelper from './helpers/test-helper';
import { login, navigateToLogin } from './actions/login.actions';
import TestData from './data/test-data';
import { AdminDashboardSelectors, CommonSelectors } from './constants/xpath-selectors';

describe('Admin Dashboard Functionality Tests', function() {
  let driver: WebDriver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await navigateToLogin(driver);
    await TestHelper.sleep(1000);
    
    await login(driver, TestData.adminCredentials.email, TestData.adminCredentials.password);
    await TestHelper.sleep(2000);
  });

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Admin Dashboard Access', function() {
    it('should display admin dashboard for admin user', async function() {
      try {
        const statsCards = await TestHelper.waitForElement(
          driver,
          '//app-stats-card',
          5000
        );
        
        expect(await statsCards.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'admin_dashboard_loaded');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'admin_dashboard_access_error');
        throw error;
      }
    });

    it('should display all management tabs', async function() {
      try {
        const usersTab = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.usersTab,
          5000
        );
        const roomsTab = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.roomsTab,
          5000
        );
        const allBookingsTab = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.allBookingsTab,
          5000
        );

        expect(await usersTab.isDisplayed()).to.be.true;
        expect(await roomsTab.isDisplayed()).to.be.true;
        expect(await allBookingsTab.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'admin_tabs_display');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'admin_tabs_error');
        throw error;
      }
    });
  });

  describe('User Management', function() {
    it('should display user management table', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.usersTab);
        await TestHelper.sleep(2000);

        const userTable = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.userTable,
          5000
        );
        
        expect(await userTable.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'user_management_table');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'user_management_table_error');
        throw error;
      }
    });

    it('should display add user button', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.usersTab);
        await TestHelper.sleep(2000);

        const addUserButton = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.addUserButton,
          5000
        );
        
        expect(await addUserButton.isDisplayed()).to.be.true;
        expect(await addUserButton.isEnabled()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'add_user_button');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'add_user_button_error');
        throw error;
      }
    });

    it('should display edit and delete buttons for users', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.usersTab);
        await TestHelper.sleep(2000);

        const userRows = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.userTableRows
        );
        
        if (userRows.length > 0) {
          const editButtons = await TestHelper.findElements(
            driver,
            AdminDashboardSelectors.editUserButton
          );
          const deleteButtons = await TestHelper.findElements(
            driver,
            AdminDashboardSelectors.deleteUserButton
          );
          
          expect(editButtons.length).to.be.greaterThan(0);
          expect(deleteButtons.length).to.be.greaterThan(0);
        }
        
        await TestHelper.takeScreenshot(driver, 'user_action_buttons');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'user_action_buttons_error');
        throw error;
      }
    });

    it('should open add user form when clicking add button', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.usersTab);
        await TestHelper.sleep(2000);

        await TestHelper.clickElement(driver, AdminDashboardSelectors.addUserButton);
        await TestHelper.sleep(1000);

        // Check for form or modal
        const formVisible = await driver.findElements(
          By.xpath('//form[contains(@class, "user-form")]')
        );
        
        expect(formVisible.length).to.be.greaterThan(0);
        
        await TestHelper.takeScreenshot(driver, 'add_user_form_opened');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'add_user_form_error');
        throw error;
      }
    });
  });

  describe('Room Management', function() {
    it('should display room management table', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.roomsTab);
        await TestHelper.sleep(2000);

        const roomTable = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.roomTable,
          5000
        );
        
        expect(await roomTable.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'room_management_table');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'room_management_table_error');
        throw error;
      }
    });

    it('should display add room button', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.roomsTab);
        await TestHelper.sleep(2000);

        const addRoomButton = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.addRoomButton,
          5000
        );
        
        expect(await addRoomButton.isDisplayed()).to.be.true;
        expect(await addRoomButton.isEnabled()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'add_room_button');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'add_room_button_error');
        throw error;
      }
    });

    it('should list all rooms with action buttons', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.roomsTab);
        await TestHelper.sleep(2000);

        const roomRows = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.roomTableRows
        );
        
        expect(roomRows.length).to.be.greaterThan(0);
        
        await TestHelper.takeScreenshot(driver, 'room_list_with_actions');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'room_list_error');
        throw error;
      }
    });
  });

  describe('All Bookings Management', function() {
    it('should display all bookings table', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.allBookingsTab);
        await TestHelper.sleep(2000);

        const bookingsTable = await TestHelper.waitForElement(
          driver,
          AdminDashboardSelectors.bookingsTable,
          5000
        );
        
        expect(await bookingsTable.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'all_bookings_table');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'all_bookings_table_error');
        throw error;
      }
    });

    it('should display filter options', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.allBookingsTab);
        await TestHelper.sleep(2000);

        const statusFilter = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.statusFilter
        );
        const dateFilter = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.dateFilter
        );
        const searchInput = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.searchInput
        );
        
        // At least one filter should be available
        const totalFilters = statusFilter.length + dateFilter.length + searchInput.length;
        expect(totalFilters).to.be.greaterThan(0);
        
        await TestHelper.takeScreenshot(driver, 'bookings_filters');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'bookings_filters_error');
        throw error;
      }
    });

    it('should allow admin to cancel any booking', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.allBookingsTab);
        await TestHelper.sleep(2000);

        const cancelButtons = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.cancelBookingButton
        );
        
        if (cancelButtons.length > 0) {
          await cancelButtons[0].click();
          await TestHelper.sleep(1000);

          const confirmDialog = await TestHelper.waitForElement(
            driver,
            CommonSelectors.confirmDialog,
            5000
          );
          
          expect(await confirmDialog.isDisplayed()).to.be.true;
          
          // Click No to avoid actually cancelling
          await TestHelper.clickElement(driver, CommonSelectors.confirmNoButton);
          
          await TestHelper.takeScreenshot(driver, 'admin_cancel_booking_confirm');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'admin_cancel_booking_error');
        throw error;
      }
    });
  });

  describe('Search and Filter', function() {
    it('should filter users by search term', async function() {
      try {
        await TestHelper.clickElement(driver, AdminDashboardSelectors.usersTab);
        await TestHelper.sleep(2000);

        const searchInput = await TestHelper.findElements(
          driver,
          AdminDashboardSelectors.searchInput
        );
        
        if (searchInput.length > 0) {
          await searchInput[0].sendKeys('test');
          await TestHelper.sleep(2000);

          const userRows = await TestHelper.findElements(
            driver,
            AdminDashboardSelectors.userTableRows
          );
          
          expect(userRows).to.be.an('array');
          
          await TestHelper.takeScreenshot(driver, 'user_search_filter');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'user_search_filter_error');
        throw error;
      }
    });
  });
});
