import { Builder, until, WebDriver, WebElement, By } from 'selenium-webdriver';
import * as firefox from 'selenium-webdriver/firefox';
import * as fs from 'fs-extra';
import * as path from 'path';

class TestHelper {
  screenshotDir: string;

  constructor() {
    this.screenshotDir = path.join(__dirname, '../../screenshots');
    fs.ensureDirSync(this.screenshotDir);
  }

  async createDriver(): Promise<WebDriver> {
    const options = new firefox.Options();
    
    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
    
    await driver.manage().window().maximize();
    
    return driver;
  }

  async takeScreenshot(driver: WebDriver, testName: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const filename = `${testName}_${timestamp}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    
    const screenshot = await driver.takeScreenshot();
    await fs.writeFile(filepath, screenshot, 'base64');
    
    if ((global as any).testContext) {
      (global as any).testContext.addContext({
        title: testName,
        value: `../screenshots/${filename}`
      });
    }
    
    return filepath;
  }

  async waitForElement(driver: WebDriver, xpath: string, timeout: number = 10000): Promise<WebElement> {
    return await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  }

  async clickElement(driver: WebDriver, xpath: string, timeout: number = 10000): Promise<void> {
    const element = await this.waitForElement(driver, xpath, timeout);
    await element.click();
  }

  async findElements(driver: WebDriver, xpath: string): Promise<WebElement[]> {
    return await driver.findElements(By.xpath(xpath));
  }

  async clearAndType(driver: WebDriver, element: WebElement, text: string): Promise<void> {
    await element.clear();
    await element.sendKeys(text);
  }

  async selectDropdownByValue(element: WebElement, value: string): Promise<void> {
    const options = await element.findElements(By.css('option'));
    for (const option of options) {
      const optionValue = await option.getAttribute('value');
      if (optionValue === value) {
        await option.click();
        break;
      }
    }
  }

  async selectDropdownByIndex(element: WebElement, index: number): Promise<void> {
    const options = await element.findElements(By.css('option'));
    if (index < options.length) {
      await options[index].click();
    }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TestHelper();
