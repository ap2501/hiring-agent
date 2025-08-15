import re

def score_candidates_dynamic(candidates, extracted_keywords):
    """
    Score candidates dynamically based on JD keywords.
    
    extracted_keywords: {
        "job_titles": [...],
        "skills": [...],
        "companies": [...],
        "industries": [...],
        "locations": [...]
    }
    """
    # Normalize JD keywords
    jd_titles = [t.lower() for t in extracted_keywords.get("job_titles", [])]
    jd_skills = [s.lower() for s in extracted_keywords.get("skills", [])]
    jd_companies = [c.lower() for c in extracted_keywords.get("companies", [])]
    jd_industries = [i.lower() for i in extracted_keywords.get("industries", [])]
    jd_locations = [l.lower() for l in extracted_keywords.get("locations", [])]

    scored = []
    for c in candidates:
        headline = c.get("headline", "").lower()
        title = c.get("title", "").lower()
        breakdown = {}

        # Education scoring (simple placeholder)
        breakdown["education"] = 8

        # Job title match (weight 25%)
        breakdown["title_match"] = 9 if any(t in title or t in headline for t in jd_titles) else 5

        # Skill match (weight 30%)
        skill_matches = sum(1 for skill in jd_skills if skill in headline or skill in title)
        if skill_matches >= 3:
            breakdown["skills"] = 9
        elif skill_matches == 2:
            breakdown["skills"] = 7
        elif skill_matches == 1:
            breakdown["skills"] = 6
        else:
            breakdown["skills"] = 5

        # Company/Industry relevance (weight 20%)
        if any(cmp in headline for cmp in jd_companies):
            breakdown["company"] = 9
        elif any(ind in headline for ind in jd_industries):
            breakdown["company"] = 7
        else:
            breakdown["company"] = 5

        # Location match (weight 10%)
        breakdown["location"] = 9 if any(loc in headline for loc in jd_locations) else 5

        # Experience (weight 10%)
        experience_years = c.get("experience_years", 0)
        if experience_years >= 5:
            breakdown["experience"] = 9
        elif experience_years >= 3:
            breakdown["experience"] = 7
        else:
            breakdown["experience"] = 5

        # Weighted sum normalized to 0–10 scale
        weights = {
            "title_match": 0.25,
            "skills": 0.3,
            "company": 0.2,
            "location": 0.1,
            "experience": 0.1,
            "education": 0.05
        }
        raw_score = sum(breakdown[k] * w for k, w in weights.items())
        normalized_score = round((raw_score / 9) * 10, 2)  # max of each metric is 9

        scored.append({
            "name": c["name"],
            "linkedin_url": c["linkedin_url"],
            "headline": c.get("headline", ""),
            "score": normalized_score,
            "breakdown": breakdown
        })

    # Sort by descending score
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored
