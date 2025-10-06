import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

DEFAULT_KEYS = {"job_titles": [], "skills": [], "location": [], "companies": []}

def extract_keywords_from_jd(job_description: str, max_keywords: int = 20):
    """
    Extract important keywords from a job description using Groq.
    Focus on: job titles, skills, companies, locations.
    Returns a structured dict and a flattened list.
    """
    if not job_description.strip():
        return DEFAULT_KEYS.copy(), []

    # Truncate JD at 1500 chars to avoid overwhelming the model
    truncated_jd = job_description[:1500] + ("..." if len(job_description) > 1500 else "")

    prompt = f"""
    Extract search terms from this job description for finding LinkedIn profiles.
    Focus on: job titles, required skills, technologies, location, company names.

    Job Description: {truncated_jd}

    Return ONLY a JSON object like this:
    {json.dumps(DEFAULT_KEYS)}
    """

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,  # lower temp for more deterministic output
            max_tokens=400
        )

        result = response.choices[0].message.content.strip()

        # Safely extract JSON from the response
        json_start = result.find("{")
        json_end = result.rfind("}") + 1
        extracted_data = DEFAULT_KEYS.copy()

        if json_start != -1 and json_end != 0:
            try:
                data = json.loads(result[json_start:json_end])
                for key in DEFAULT_KEYS:
                    extracted_data[key] = data.get(key, [])
            except json.JSONDecodeError:
                pass  # fallback to default keys

        # Flatten keywords
        flattened_keywords = []
        for key in ["job_titles", "skills", "location", "companies"]:
            flattened_keywords.extend(extracted_data[key])

        # Ensure basic fallback keywords if empty
        if not flattened_keywords:
            basic_keywords = ["Software Engineer", "Python", "Machine Learning", "AI", "Data"]
            flattened_keywords.extend(basic_keywords)

        return extracted_data, flattened_keywords[:max_keywords]

    except Exception as e:
        print(f"Error extracting keywords: {e}")
        fallback_keywords = ["Software Engineer", "Python", "Machine Learning", "AI", "Data"]
        return DEFAULT_KEYS.copy(), fallback_keywords[:max_keywords]
