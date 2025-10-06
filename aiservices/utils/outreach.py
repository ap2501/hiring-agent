# aiservices/enhanced_outreach.py
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class OutreachGenerator:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
            self.use_groq = True
        else:
            print("Warning: Groq API key not found. Using basic outreach.")
            self.use_groq = False

    def generate_message(self, candidate, job_description):
        """
        Generate a personalized outreach message for a candidate based on JD.
        """
        if not self.use_groq:
            return self._basic_message(candidate, job_description)

        # Prepare candidate info
        first_name = candidate.get("name", "there").split()[0]
        headline = candidate.get("headline", "")
        companies = candidate.get("companies", [])
        skills = candidate.get("skills", [])
        exp_years = candidate.get("experience_years", 0)
        role_level = candidate.get("role_level", "")
        industry = candidate.get("industry", "")

        prompt = f"""
        Generate a personalized LinkedIn outreach message for a candidate.

        Candidate:
        Name: {candidate.get('name', '')}
        Headline: {headline}
        Companies: {', '.join(companies) if companies else 'N/A'}
        Skills: {', '.join(skills) if skills else 'N/A'}
        Experience: {exp_years} years
        Role Level: {role_level}
        Industry: {industry}

        Job Description: {job_description}

        Requirements:
        - Start with a greeting using first name
        - Mention a relevant detail from their profile
        - Connect to the job opportunity
        - Keep it professional and friendly
        - Max 150 words
        Return only the message text.
        """

        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=200
            )

            message = response.choices[0].message.content.strip()
            return message if message else self._basic_message(candidate, job_description)
        except Exception as e:
            print(f"Groq error: {e}")
            return self._basic_message(candidate, job_description)

    def _basic_message(self, candidate, job_description):
        """
        Fallback simple outreach if Groq fails.
        """
        first_name = candidate.get("name", "there").split()[0]
        headline = candidate.get("headline", "their experience")
        return (f"Hi {first_name}, I came across your profile with headline '{headline}'. "
                f"We have an opportunity that aligns with your experience. "
                f"Would you like to discuss this further?")

def generate_outreach(candidates, job_description):
    """
    Generate outreach messages for a list of scored candidates.
    """
    generator = OutreachGenerator()
    messages = []
    for c in candidates:
        messages.append({
            "candidate": c.get("name"),
            "linkedin_url": c.get("linkedin_url", ""),
            "score": c.get("score", 0),
            "message": generator.generate_message(c, job_description)
        })
    return messages
