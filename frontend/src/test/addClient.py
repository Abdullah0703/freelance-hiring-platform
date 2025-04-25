from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up Chrome driver
driver = webdriver.Chrome()

try:
    # Step 1: Open login page
    driver.get("http://localhost:3000/")  

    # Step 2: Login as admin
    WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter your email address']"))).send_keys("admin@gmail.com")
    WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))).send_keys("admin")
    driver.find_element(By.ID, "sign-in-button").click()

    # Wait for the dashboard to load
    WebDriverWait(driver, 100).until(EC.url_contains("dashboard"))
    print("✅ Admin Login Successful!")

    # Step 3: Go to Clients Page
    driver.get("http://localhost:3000/clients")

    # Step 4: Click "Create New Client" Button
    create_client_button = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Client')]")))
    create_client_button.click()

    # Step 5: Wait for the Drawer to Fully Open
    WebDriverWait(driver, 100).until(EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
    print("✅ Client creation form opened!")

    # Step 6: Fill out the client fields using label-based XPaths
    name_field = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Name')]/following-sibling::input")))
    name_field.send_keys("Group_G")

    address_field = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Address')]/following-sibling::input")))
    address_field.send_keys("123 Main St")

    contact_field = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Contact No.')]/following-sibling::input")))
    contact_field.send_keys("1234567890")

    email_field = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Email Address')]/following-sibling::input")))
    email_field.send_keys("ghulambaqir303@gmail.com")

    password_field = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Password')]/following-sibling::input")))
    password_field.send_keys("baqir")

    print("✅ Client fields filled!")

    # Step 7: Submit the client form
    submit_button = WebDriverWait(driver, 100).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add Client')]")))
    submit_button.click()

    # Step 8: Wait for confirmation message
    WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Client has been added successfully!')]")))

    print("✅ Client Created Successfully!")

except Exception as e:
    print(f"❌ Test Failed: {e}")

finally:
    driver.quit()