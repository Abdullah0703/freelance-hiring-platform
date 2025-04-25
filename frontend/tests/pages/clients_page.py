from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class ClientsPage:
    def __init__(self, driver):
        self.driver = driver

    def create_client(self):
        self.driver.get("http://localhost:3000/clients")
        WebDriverWait(self.driver, 40).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Client')]"))).click()
        WebDriverWait(self.driver, 40).until(EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Name')]/following-sibling::input").send_keys("Group_G")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Address')]/following-sibling::input").send_keys("123 Main St")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Contact No.')]/following-sibling::input").send_keys("1234567890")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Email Address')]/following-sibling::input").send_keys("ghulambaqir303@gmail.com")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Password')]/following-sibling::input").send_keys("baqir")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add Client')]").click()
