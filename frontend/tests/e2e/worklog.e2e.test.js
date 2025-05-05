const { Builder, By, until } = require('selenium-webdriver');

(async function worklogTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Test started');
        await driver.get('http://localhost:3000'); // Change to your app's URL
        // Example: Find and click "Add Work Log" button
        await driver.findElement(By.xpath("//button[contains(text(),'Add Work Log')]")).click();
        // Fill in form fields
        await driver.findElement(By.name('description')).sendKeys('Automated Work Log');
        await driver.findElement(By.name('hours')).sendKeys('2');
        // Submit the form
        await driver.findElement(By.xpath("//button[contains(text(),'Submit')]")).click();
        // Wait for confirmation or check for new entry
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Automated Work Log')]")), 5000);
        console.log('Work log added successfully!');
    } catch (err) {
        console.error('Test failed:', err);
    }
    finally {
        await driver.quit();
    }
})();