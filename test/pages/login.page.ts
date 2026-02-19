import { WebDriver, By, WebElement } from 'selenium-webdriver';

const LoginPage = {
  url: 'http://localhost:4200/login',
  
  selectors: {
    emailInput: By.xpath('//input[@formcontrolname="email"]'),
    passwordInput: By.xpath('//input[@formcontrolname="password"]'),
    loginButton: By.xpath('//button[@type="submit"]'),
    errorMessage: By.xpath('//*[contains(@class, "error-message")]'),
    emailError: By.xpath('//input[@formcontrolname="email"]/following-sibling::div//small[@class="error-message"]'),
    passwordError: By.xpath('//input[@formcontrolname="password"]/following-sibling::div//small[@class="error-message"]'),
    successToast: By.xpath('//*[contains(@class, "p-toast-message-success")]'),
    pageTitle: By.xpath('//h1[@class="header"]'),
  },

  async navigateTo(driver: WebDriver): Promise<void> {
    await driver.get(this.url);
  },

  async getEmailInput(driver: WebDriver): Promise<WebElement> {
    return await driver.findElement(this.selectors.emailInput);
  },

  async getPasswordInput(driver: WebDriver): Promise<WebElement> {
    return await driver.findElement(this.selectors.passwordInput);
  },

  async getLoginButton(driver: WebDriver): Promise<WebElement> {
    return await driver.findElement(this.selectors.loginButton);
  },

  async enterEmail(driver: WebDriver, email: string): Promise<void> {
    const emailInput = await this.getEmailInput(driver);
    await emailInput.clear();
    await emailInput.sendKeys(email);
  },

  async enterPassword(driver: WebDriver, password: string): Promise<void> {
    const passwordInput = await this.getPasswordInput(driver);
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  },

  async clickLogin(driver: WebDriver): Promise<void> {
    const loginButton = await this.getLoginButton(driver);
    await loginButton.click();
  },

  async login(driver: WebDriver, email: string, password: string): Promise<void> {
    await this.enterEmail(driver, email);
    await this.enterPassword(driver, password);
    await this.clickLogin(driver);
  },

  async getCurrentUrl(driver: WebDriver): Promise<string> {
    return await driver.getCurrentUrl();
  },

  async isLoginButtonEnabled(driver: WebDriver): Promise<boolean> {
    const loginButton = await this.getLoginButton(driver);
    return await loginButton.isEnabled();
  }
};

export default LoginPage;
