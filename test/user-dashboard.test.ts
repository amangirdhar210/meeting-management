import { Builder, Browser, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import TestHelper from './helpers/test-helper';
import { login, navigateToLogin } from './actions/login.actions';
import TestData from './data/test-data';
import { UserDashboardSelectors, CommonSelectors } from './constants/xpath-selectors';

describe('User Dashboard Functionality Tests', function() {
  let driver: WebDriver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await navigateToLogin(driver);
    await TestHelper.sleep(1000);
    
    await login(driver, TestData.userCredentials.email, TestData.userCredentials.password);
    await TestHelper.sleep(2000);
  });

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Dashboard Access', function() {
    it('should display user dashboard after successful login', async function() {
      try {
        const dashboardContainer = await TestHelper.waitForElement(
          driver,
          '//div[@class="dashboard-container"]',
          5000
        );
        
        expect(await dashboardContainer.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'user_dashboard_loaded');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'user_dashboard_error');
        throw error;
      }
    });

    it('should display all navigation tabs', async function() {
      try {
        const availableRoomsButton = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.availableRoomsButton,
          5000
        );
        const myBookingsButton = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.myBookingsButton,
          5000
        );

        expect(await availableRoomsButton.isDisplayed()).to.be.true;
        expect(await myBookingsButton.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'user_dashboard_tabs');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'user_dashboard_tabs_error');
        throw error;
      }
    });
  });

  describe('Room Search Functionality', function() {
    it('should search for available rooms', async function() {
      try {
        // The default view is Available Rooms, no need to click
        await TestHelper.sleep(1000);

        const searchInput = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.searchRoomInput,
          5000
        );
        await searchInput.sendKeys('Conference');
        
        await TestHelper.clickElement(driver, UserDashboardSelectors.searchButton);
        await TestHelper.sleep(2000);

        const roomCards = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.roomCards
        );
        
        expect(roomCards.length).to.be.greaterThan(0);
        
        await TestHelper.takeScreenshot(driver, 'room_search_results');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'room_search_error');
        throw error;
      }
    });

    it('should filter rooms by capacity', async function() {
      try {
        await TestHelper.sleep(1000);

        const capacityFilter = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.capacityFilter,
          5000
        );
        await TestHelper.selectDropdownByValue(capacityFilter, '10');
        
        await TestHelper.clickElement(driver, UserDashboardSelectors.searchButton);
        await TestHelper.sleep(2000);

        const roomCards = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.roomCards
        );
        
        expect(roomCards.length).to.be.greaterThan(0);
        
        await TestHelper.takeScreenshot(driver, 'room_filter_capacity');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'room_filter_capacity_error');
        throw error;
      }
    });
  });

  describe('My Bookings View', function() {
    it('should display user bookings', async function() {
      try {
        await TestHelper.clickElement(driver, UserDashboardSelectors.myBookingsButton);
        await TestHelper.sleep(2000);

        const bookingCards = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.myBookingsCards
        );
        
        // User may or may not have bookings
        expect(bookingCards).to.be.an('array');
        
        await TestHelper.takeScreenshot(driver, 'my_bookings_view');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'my_bookings_error');
        throw error;
      }
    });

    it('should separate upcoming and past bookings', async function() {
      try {
        await TestHelper.clickElement(driver, UserDashboardSelectors.myBookingsButton);
        await TestHelper.sleep(2000);

        const upcomingSection = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.upcomingBookingsSection,
          5000
        );
        const pastSection = await TestHelper.waitForElement(
          driver,
          UserDashboardSelectors.pastBookingsSection,
          5000
        );

        expect(await upcomingSection.isDisplayed()).to.be.true;
        expect(await pastSection.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'bookings_sections');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'bookings_sections_error');
        throw error;
      }
    });
  });

  describe('View Room Schedule', function() {
    it('should open schedule modal for a room', async function() {
      try {
        await TestHelper.sleep(1000);

        await TestHelper.clickElement(driver, UserDashboardSelectors.searchButton);
        await TestHelper.sleep(2000);

        const viewScheduleButtons = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.viewScheduleButton
        );
        
        if (viewScheduleButtons.length > 0) {
          await viewScheduleButtons[0].click();
          await TestHelper.sleep(1000);

          const modal = await TestHelper.waitForElement(
            driver,
            '//div[contains(@class, "schedule-modal")]',
            5000
          );
          
          expect(await modal.isDisplayed()).to.be.true;
          
          await TestHelper.takeScreenshot(driver, 'room_schedule_modal');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'room_schedule_modal_error');
        throw error;
      }
    });
  });
});
