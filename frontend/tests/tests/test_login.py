from pages.login_page import LoginPage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def test_login(driver):
    login_page = LoginPage(driver)

    # Step 1: Perform login
    login_page.login("admin@gmail.com", "admin")

    # Step 2: Wait for redirection to dashboard
    WebDriverWait(driver, 40).until(EC.url_contains("dashboard"))
    assert "dashboard" in driver.current_url, "❌ Login failed: not redirected to dashboard"
    print("✅ Login redirect verified.")

    # Step 3: Verify dashboard heading or a specific dashboard element
    dashboard_heading = WebDriverWait(driver, 40).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Dashboard')]"))
    )
    assert dashboard_heading.is_displayed(), "❌ Dashboard heading not visible after login"
    print("✅ Dashboard heading is visible.")

