import { WebDriver, By } from 'selenium-webdriver';
import LoginPage from '../pages/login.page';
import { LoginPageSelectors } from '../constants/xpath-selectors';

export const login = async function(driver: WebDriver, email: string, password: string): Promise<void> {
  await driver.get(LoginPage.url);
  await driver.findElement(By.xpath(LoginPageSelectors.emailInput)).sendKeys(email);
  await driver.findElement(By.xpath(LoginPageSelectors.passwordInput)).sendKeys(password);
  await driver.findElement(By.xpath(LoginPageSelectors.submitButton)).click();
};

export const navigateToLogin = async function(driver: WebDriver): Promise<void> { 
  await driver.get(LoginPage.url);
};

export const getCurrentUrl = async function(driver: WebDriver): Promise<string> {
  return await driver.getCurrentUrl();
};

export const getErrorMessage = async function(driver: WebDriver): Promise<string | null> {
  try {
    const errorElement = await driver.findElement(By.xpath(LoginPageSelectors.emailError));
    return await errorElement.getText();
  } catch (error) {
    return null;
  }
};
