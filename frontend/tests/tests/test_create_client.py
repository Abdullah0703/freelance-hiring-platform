import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Test for creating a client
@pytest.mark.usefixtures("driver")
def test_create_client(driver):
    try:
        # Step 1: Open login page
        driver.get("http://localhost:3000/")

        # Step 2: Login as admin
        WebDriverWait(driver, 40).until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email address']"))
        ).send_keys("admin@gmail.com")

        WebDriverWait(driver, 40).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
        ).send_keys("admin")

        driver.find_element(By.ID, "sign-in-button").click()

        # Step 3: Wait for the dashboard to load
        WebDriverWait(driver, 40).until(EC.url_contains("dashboard"))
        assert "dashboard" in driver.current_url, "❌ Login did not redirect to dashboard"
        print("✅ Admin Login Successful!")

        # Step 4: Go to Clients Page
        driver.get("http://localhost:3000/clients")

        # Step 5: Click "Create New Client" Button
        create_client_button = WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Client')]"))
        )
        create_client_button.click()

        # Step 6: Wait for the Drawer to Fully Open
        dialog = WebDriverWait(driver, 40).until(
            EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']"))
        )
        assert dialog.is_displayed(), "❌ Client creation form did not open"
        print("✅ Client creation form opened!")

        # Step 7: Fill out the client fields
        WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Name')]/following-sibling::input"))
        ).send_keys("Group_G")

        WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Address')]/following-sibling::input"))
        ).send_keys("123 Main St")

        WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Contact No.')]/following-sibling::input"))
        ).send_keys("1234567890")

        WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Email Address')]/following-sibling::input"))
        ).send_keys("ghulambaqir303@gmail.com")

        WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Password')]/following-sibling::input"))
        ).send_keys("baqir")

        print("✅ Client fields filled!")

        # Step 8: Submit the client form
        submit_button = WebDriverWait(driver, 40).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add Client')]"))
        )
        submit_button.click()

        # Step 9: Wait for confirmation message
        success_message = WebDriverWait(driver, 40).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Client has been added successfully!')]"))
        )
        assert success_message.is_displayed(), "❌ Success message not shown after client creation"
        print("✅ Client Created Successfully!")

    except Exception as e:
        print(f"❌ Test Failed: {e}")
        assert False, f"Test failed due to: {e}"

    finally:
        driver.quit()
