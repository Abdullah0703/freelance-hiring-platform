import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time

class GoogleSearchTest(unittest.TestCase):
    def setUp(self):
        # Set up Chrome driver
        self.driver = webdriver.Chrome()  # No need for path if it's in PATH

    def test_search_chatgpt(self):
        driver = self.driver
        driver.get("https://www.google.com")

        # Accept cookies if prompt appears (optional, depending on location)
        try:
            agree_button = driver.find_element(By.ID, "L2AGLb")
            agree_button.click()
        except:
            pass  # Button not shown

        # Find the search box and search for ChatGPT
        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys("ChatGPT")
        search_box.submit()

        time.sleep(2)  # Let results load (you can use WebDriverWait instead)

        # Check title
        self.assertIn("ChatGPT", driver.title)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
