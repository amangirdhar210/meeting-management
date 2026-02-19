import { Builder, By, Browser, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import TestHelper from './helpers/test-helper';
import { login, navigateToLogin, getCurrentUrl } from './actions/login.actions';
import TestData from './data/test-data';
import { LoginPageSelectors, DashboardSelectors } from './constants/xpath-selectors';

describe('Login Functionality Tests', function() {
  let driver: WebDriver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await navigateToLogin(driver);
    await TestHelper.sleep(1000);
  });

  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  describe('Valid Credentials Login', function() {
    it('should login successfully with existing user credentials', async function() {
      try {
        await login(driver, TestData.validCredentials.email, TestData.validCredentials.password);
        await TestHelper.sleep(3000);

        const dashboardHeader = await driver.findElement(By.xpath(DashboardSelectors.appHeader)).isDisplayed();
        const statsCards = await driver.findElements(By.xpath(DashboardSelectors.statsCards));

        expect(dashboardHeader).to.be.true;
        expect(statsCards.length).to.be.greaterThan(0);

        await TestHelper.takeScreenshot(driver, 'valid_login_result');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'valid_login_error');
        throw error;
      }
    });
  });

  describe('Non-Existing Email Login', function() {
    it('should fail login with non-existing email', async function() {
      try {
        await login(driver, TestData.nonExistingCredentials.email, TestData.nonExistingCredentials.password);
        await TestHelper.sleep(3000);

        // Should still be on login page after failed login
        const loginForm = await driver.findElement(By.xpath(LoginPageSelectors.loginForm)).isDisplayed();
        const emailInput = await driver.findElement(By.xpath(LoginPageSelectors.emailInput)).isDisplayed();

        expect(loginForm).to.be.true;
        expect(emailInput).to.be.true;

        await TestHelper.takeScreenshot(driver, 'nonexisting_login_result');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'nonexisting_login_error');
        throw error;
      }
    });
  });

  describe('Invalid Email Format Validation', function() {
    it('should display validation error for invalid email format', async function() {
      try {
        await driver.findElement(By.xpath(LoginPageSelectors.emailInput)).sendKeys(TestData.invalidEmailFormat.email);
        await driver.findElement(By.xpath(LoginPageSelectors.passwordInput)).click();
        await TestHelper.sleep(500);

        const emailInputValue = await driver.findElement(By.xpath(LoginPageSelectors.emailInput)).getAttribute('value');
        const loginButton = await driver.findElement(By.xpath(LoginPageSelectors.submitButton)).isEnabled();

        expect(emailInputValue).to.equal(TestData.invalidEmailFormat.email);
        expect(loginButton).to.be.false;

        await TestHelper.takeScreenshot(driver, 'invalid_email_result');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'invalid_email_error');
        throw error;
      }
    });
  });

  describe('Short Password Validation', function() {
    it('should display validation error for password length', async function() {
      try {
        await driver.findElement(By.xpath(LoginPageSelectors.emailInput)).sendKeys(TestData.shortPassword.email);
        await driver.findElement(By.xpath(LoginPageSelectors.passwordInput)).sendKeys(TestData.shortPassword.password);
        await TestHelper.sleep(500);

        const passwordValue = await driver.findElement(By.xpath(LoginPageSelectors.passwordInput)).getAttribute('value');
        const loginButton = await driver.findElement(By.xpath(LoginPageSelectors.submitButton)).isEnabled();

        expect(passwordValue.length).to.be.lessThan(6);
        expect(loginButton).to.be.false;

        await TestHelper.takeScreenshot(driver, 'short_password_result');
      } catch (error) {
        await TestHelper.takeScreenshot(driver, 'short_password_error');
        throw error;
      }
    });
  });
});
