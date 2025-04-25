import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

# Test for creating a job
@pytest.mark.usefixtures("driver")
def test_create_job(driver):
    try:
        # Step 1: Open login page
        driver.get("http://localhost:3000/")

        # Step 2: Login as user
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email address']"))
        ).send_keys("ghulambaqir303@gmail.com")

        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
        ).send_keys("baqir")

        driver.find_element(By.ID, "sign-in-button").click()

        # Step 3: Wait for dashboard to load
        WebDriverWait(driver, 30).until(EC.url_contains("dashboard"))
        assert "dashboard" in driver.current_url, "❌ Dashboard URL not loaded!"
        print("✅ Login Successful!")

        # Step 4: Go to Jobs Page
        driver.get("http://localhost:3000/jobs")
        assert "jobs" in driver.current_url, "❌ Jobs page did not load!"

        # Step 5: Click "Create New Job"
        create_job_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Job')]"))
        )
        create_job_button.click()

        # Step 6: Wait for the Drawer to Fully Open
        drawer = WebDriverWait(driver, 30).until(
            EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']"))
        )
        assert drawer.is_displayed(), "❌ Job creation drawer not visible!"
        print("✅ Job creation drawer opened!")

        # Step 7: Fill out the job fields
        title_field = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Title')]/following-sibling::input"))
        )
        title_field.send_keys("Group-G-Software Engineer")
        assert title_field.get_attribute("value") == "Group-G-Software Engineer", "❌ Title input mismatch!"

        skills_field = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Required Skills')]/following-sibling::textarea"))
        )
        skills_field.send_keys("Python, Selenium, Web Automation")
        assert "Python" in skills_field.get_attribute("value"), "❌ Skills input not filled properly!"

        description_field = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Description')]/following-sibling::textarea"))
        )
        description_field.send_keys("Automate web testing using Selenium and Python.")
        assert "Selenium" in description_field.get_attribute("value"), "❌ Description input not correct!"

        # Step 8: Fill Payment Terms (Dropdown)
        payment_terms_dropdown = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Payment Terms')]/following-sibling::div/select"))
        )
        Select(payment_terms_dropdown).select_by_visible_text("Hourly")
        assert Select(payment_terms_dropdown).first_selected_option.text == "Hourly", "❌ Payment Terms not selected!"
        print("✅ Payment Terms filled!")

        # Step 9: Fill Duration (Dropdown)
        duration_dropdown = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Duration')]/following-sibling::div/select"))
        )
        Select(duration_dropdown).select_by_visible_text("Temporary")
        assert Select(duration_dropdown).first_selected_option.text == "Temporary", "❌ Duration not selected!"
        print("✅ Duration filled!")

        # Step 10: Fill Budget (Input)
        budget_field = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Budget')]/following-sibling::input"))
        )
        budget_field.send_keys("500")
        assert budget_field.get_attribute("value") == "500", "❌ Budget input mismatch!"
        print("✅ Budget filled!")

        # Step 11: Submit the job form
        submit_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add Job')]"))
        )
        submit_button.click()

        # Step 12: Wait for confirmation message
        success_msg = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Job has been added successfully!')]"))
        )
        assert success_msg.is_displayed(), "❌ Success message not shown!"
        print("✅ Job Created Successfully!")

    except Exception as e:
        print(f"❌ Test Failed: {e}")
        assert False, f"Test failed due to: {e}"

    finally:
        driver.quit()
