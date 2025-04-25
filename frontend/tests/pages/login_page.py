from selenium.webdriver.common.by import By

class LoginPage:
    def __init__(self, driver):
        self.driver = driver

    def login(self, email, password):
        self.driver.get("http://localhost:3000/")
        self.driver.find_element(By.XPATH, "//input[@placeholder='Enter your email address']").send_keys(email)
        self.driver.find_element(By.XPATH, "//input[@type='password']").send_keys(password)
        self.driver.find_element(By.ID, "sign-in-button").click()