from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

# Set up Chrome driver
driver = webdriver.Chrome()

try:
    # Step 1: Open login page
    driver.get("http://localhost:3000/")  

    # Step 2: Login
    WebDriverWait(driver, 300).until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email address']"))).send_keys("ghulambaqir303@gmail.com")
    WebDriverWait(driver, 300).until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))).send_keys("baqir")
    driver.find_element(By.ID, "sign-in-button").click()

    # Wait for the dashboard to load
    WebDriverWait(driver, 300).until(EC.url_contains("dashboard"))
    print("✅ Login Successful!")

    # Step 3: Go to Jobs Page
    driver.get("http://localhost:3000/jobs")

    # Step 4: Click "Create New Job" Button
    create_job_button = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Job')]")))
    create_job_button.click()

    # Step 5: Wait for the Drawer to Fully Open
    WebDriverWait(driver, 300).until(EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
    print("✅ Job creation drawer opened!")

    # Step 6: Fill out the job fields using label-based XPaths
    title_field = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Title')]/following-sibling::input")))
    title_field.send_keys("Group-G-Software Engineer")

    skills_field = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Required Skills')]/following-sibling::textarea")))
    skills_field.send_keys("Python, Selenium, Web Automation")

    description_field = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Description')]/following-sibling::textarea")))
    description_field.send_keys("Automate web testing using Selenium and Python.")

    # Step 7: Fill Payment Terms (Dropdown)
    payment_terms_dropdown = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Payment Terms')]/following-sibling::div/select")))
    Select(payment_terms_dropdown).select_by_visible_text("Hourly")  # Select "Hourly"
    print("✅ Payment Terms filled!")

    # Step 8: Fill Duration (Dropdown)
    duration_dropdown = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Duration')]/following-sibling::div/select")))
    Select(duration_dropdown).select_by_visible_text("Temporary")  # Select "Temporary"
    print("✅ Duration filled!")

    # Step 9: Fill Budget (Input)
    budget_field = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Budget')]/following-sibling::input")))
    budget_field.send_keys("500")
    print("✅ Budget filled!")

    # Step 300: Submit the job form
    submit_button = WebDriverWait(driver, 300).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add Job')]")))
    submit_button.click()

    # Step 11: Wait for confirmation message
    WebDriverWait(driver, 300).until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Job has been added successfully!')]")))

    print("✅ Job Created Successfully!")

except Exception as e:
    print(f"❌ Test Failed: {e}")

finally:
    driver.quit()