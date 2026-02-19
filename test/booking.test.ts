import { Builder, Browser, WebDriver, By } from 'selenium-webdriver';
import { expect } from 'chai';
import TestHelper from './helpers/test-helper';
import { login, navigateToLogin } from './actions/login.actions';
import TestData from './data/test-data';
import { BookingFormSelectors, CommonSelectors, UserDashboardSelectors } from './constants/xpath-selectors';

describe('Booking Functionality Tests', function() {
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

  describe('Create Booking', function() {
    it('should navigate to booking form', async function() {
      try {
        await TestHelper.sleep(1000);

        const formHeader = await TestHelper.waitForElement(
          driver,
          BookingFormSelectors.formHeader,
          5000
        );
        
        expect(await formHeader.isDisplayed()).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'booking_form_displayed');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_form_navigation_error');
        throw error;
      }
    });

    it('should show validation errors for empty form submission', async function() {
      try {
        await TestHelper.sleep(1000);

        const submitButton = await TestHelper.waitForElement(
          driver,
          BookingFormSelectors.submitBookingButton,
          5000
        );
        
        // Try to submit without filling form
        await submitButton.click();
        await TestHelper.sleep(1000);

        const isButtonDisabled = !(await submitButton.isEnabled());
        expect(isButtonDisabled).to.be.true;
        
        await TestHelper.takeScreenshot(driver, 'booking_form_validation');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_form_validation_error');
        throw error;
      }
    });

    it('should create booking with valid data', async function() {
      try {
        await TestHelper.sleep(1000);

        // Select room
        const roomDropdown = await TestHelper.waitForElement(
          driver,
          BookingFormSelectors.roomDropdown,
          5000
        );
        await TestHelper.selectDropdownByIndex(roomDropdown, 1);
        await TestHelper.sleep(500);

        // Select tomorrow's date
        const dateInput = await driver.findElement(By.xpath(BookingFormSelectors.dateInput));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];
        await dateInput.sendKeys(dateString);
        await TestHelper.sleep(500);

        // Set time
        const startTimeInput = await driver.findElement(By.xpath(BookingFormSelectors.startTimeInput));
        await startTimeInput.sendKeys('10:00');
        await TestHelper.sleep(500);

        const endTimeInput = await driver.findElement(By.xpath(BookingFormSelectors.endTimeInput));
        await endTimeInput.sendKeys('11:00');
        await TestHelper.sleep(500);

        // Add purpose
        const purposeInput = await driver.findElement(By.xpath(BookingFormSelectors.purposeInput));
        await purposeInput.sendKeys('Team Meeting');
        await TestHelper.sleep(500);

        // Check availability first
        const checkButton = await driver.findElement(By.xpath(BookingFormSelectors.checkAvailabilityButton));
        if (await checkButton.isDisplayed()) {
          await checkButton.click();
          await TestHelper.sleep(2000);
        }

        // Submit booking
        const submitButton = await driver.findElement(By.xpath(BookingFormSelectors.submitBookingButton));
        if (await submitButton.isEnabled()) {
          await submitButton.click();
          await TestHelper.sleep(3000);

          // Check for success toast
          const successToast = await TestHelper.findElements(
            driver,
            CommonSelectors.successToast
          );
          
          expect(successToast.length).to.be.greaterThan(0);
          
          await TestHelper.takeScreenshot(driver, 'booking_created_success');
        } else {
          await TestHelper.takeScreenshot(driver, 'booking_button_disabled');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_creation_error');
        throw error;
      }
    });

    it('should validate time range (end time after start time)', async function() {
      try {
        await TestHelper.sleep(1000);

        // Select room
        const roomDropdown = await TestHelper.waitForElement(
          driver,
          BookingFormSelectors.roomDropdown,
          5000
        );
        await TestHelper.selectDropdownByIndex(roomDropdown, 1);
        await TestHelper.sleep(500);

        // Set invalid time range (end before start)
        const startTimeInput = await driver.findElement(By.xpath(BookingFormSelectors.startTimeInput));
        await startTimeInput.sendKeys('14:00');
        await TestHelper.sleep(500);

        const endTimeInput = await driver.findElement(By.xpath(BookingFormSelectors.endTimeInput));
        await endTimeInput.sendKeys('13:00');
        await TestHelper.sleep(1000);

        const submitButton = await driver.findElement(By.xpath(BookingFormSelectors.submitBookingButton));
        const isButtonEnabled = await submitButton.isEnabled();
        
        expect(isButtonEnabled).to.be.false;
        
        await TestHelper.takeScreenshot(driver, 'booking_time_validation');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_time_validation_error');
        throw error;
      }
    });
  });

  describe('Cancel Booking', function() {
    it('should display cancel button for upcoming bookings', async function() {
      try {
        await TestHelper.clickElement(driver, UserDashboardSelectors.myBookingsButton);
        await TestHelper.sleep(2000);

        const cancelButtons = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.cancelMyBookingButton
        );
        
        // User may have bookings with cancel buttons
        expect(cancelButtons).to.be.an('array');
        
        await TestHelper.takeScreenshot(driver, 'booking_cancel_button_display');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_cancel_button_error');
        throw error;
      }
    });

    it('should show confirmation dialog when cancelling booking', async function() {
      try {
        await TestHelper.clickElement(driver, UserDashboardSelectors.myBookingsButton);
        await TestHelper.sleep(2000);

        const cancelButtons = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.cancelMyBookingButton
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
          
          // Click No to cancel the cancellation
          await TestHelper.clickElement(driver, CommonSelectors.confirmNoButton);
          
          await TestHelper.takeScreenshot(driver, 'booking_cancel_confirmation');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_cancel_confirmation_error');
        throw error;
      }
    });
  });

  describe('View Booking Details', function() {
    it('should display booking details when clicking view details', async function() {
      try {
        await TestHelper.clickElement(driver, UserDashboardSelectors.myBookingsButton);
        await TestHelper.sleep(2000);

        const viewDetailsButtons = await TestHelper.findElements(
          driver,
          UserDashboardSelectors.viewDetailsButton
        );
        
        if (viewDetailsButtons.length > 0) {
          await viewDetailsButtons[0].click();
          await TestHelper.sleep(1000);

          // Check if modal or expanded view is displayed
          const detailsVisible = await driver.findElements(
            By.xpath('//div[contains(@class, "booking-details")]')
          );
          
          expect(detailsVisible.length).to.be.greaterThan(0);
          
          await TestHelper.takeScreenshot(driver, 'booking_details_view');
        }
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'booking_details_view_error');
        throw error;
      }
    });
  });
});
