from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Set up the Chrome driver
driver = webdriver.Chrome()

try:
    # Open the login page
    driver.get("http://localhost:3000/")  

    # Find the email input field and enter email
    email_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your email address']")
    email_input.send_keys("admin@gmail.com")

    # Find the password input field and enter password
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    password_input.send_keys("admin")

    # Find and click the sign-in button
    sign_in_button = driver.find_element(By.ID, "sign-in-button")  # Update with the correct button ID or class
    sign_in_button.click()

    # Wait for redirection (adjust sleep time or use WebDriverWait for better handling)
    time.sleep(5)

    # Verify login success by checking if redirected to the dashboard
    if "dashboard" in driver.current_url:
        print("✅ Login Test Passed! Redirected to Dashboard.")
    else:
        print("❌ Login Test Failed! Check credentials or UI changes.")

finally:
    # Close the browser
    driver.quit()
