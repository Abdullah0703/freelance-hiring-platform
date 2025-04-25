from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

class JobsPage:
    def __init__(self, driver):
        self.driver = driver

    def create_job(self):
        self.driver.get("http://localhost:3000/jobs")
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Job')]"))).click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[@role='dialog']")))
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Title')]/following-sibling::input").send_keys("Group-G-Software Engineer")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Required Skills')]/following-sibling::textarea").send_keys("Python, Selenium, Web Automation")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Description')]/following-sibling::textarea").send_keys("Automate web testing using Selenium and Python.")
        Select(self.driver.find_element(By.XPATH, "//label[contains(text(), 'Payment Terms')]/following-sibling::div/select")).select_by_visible_text("Hourly")
        Select(self.driver.find_element(By.XPATH, "//label[contains(text(), 'Duration')]/following-sibling::div/select")).select_by_visible_text("Temporary")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Budget')]/following-sibling::input").send_keys("500")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add Job')]").click()
