import os
import time
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

class LinkedInSourcingAgent:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

        if not self.api_key or not self.search_engine_id:
            print("Google API credentials not found. Using static data.")
            self.use_static = True
        else:
            self.use_static = False
            self.service = build("customsearch", "v1", developerKey=self.api_key)

    def search_linkedin(self, keywords, num_results=10):
        """
        Search LinkedIn using Google Custom Search.
        `keywords` is a list of strings.
        """
        if self.use_static:
            return self._static_data()

        query = f"site:linkedin.com/in/ {' '.join(keywords)}"
        candidates = []
        start_index = 1
        per_page = 10

        while len(candidates) < num_results and start_index <= 30:
            results = self.service.cse().list(
                q=query,
                cx=self.search_engine_id,
                num=min(per_page, num_results - len(candidates)),
                start=start_index
            ).execute()

            items = results.get("items", [])
            for item in items:
                linkedin_url = item["link"]
                headline = item.get("snippet", "No headline available")
                name = self._extract_name_from_url(linkedin_url)

                candidates.append({
                    "name": name,
                    "linkedin_url": linkedin_url,
                    "headline": headline,
                    "title": item.get("title", "")
                })

                if len(candidates) >= num_results:
                    break
            if len(items) < per_page:
                break  # no more results
            start_index += per_page
            time.sleep(0.1)  # avoid hitting rate limits

        return candidates if candidates else self._static_data()

    def _extract_name_from_url(self, linkedin_url):
        try:
            parts = linkedin_url.split("/in/")
            if len(parts) > 1:
                name_part = parts[1].split("/")[0].split("?")[0]
                return name_part.replace("-", " ").replace("_", " ").title()
            return "Unknown"
        except:
            return "Unknown"

    def _static_data(self):
        return [
            {"name": "John Doe", "linkedin_url": "https://linkedin.com/in/johndoe", "headline": "Senior Backend Engineer"},
            {"name": "Jane Smith", "linkedin_url": "https://linkedin.com/in/janesmith", "headline": "Software Engineer"},
        ]
