// services/aiService.js
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL;


export const runFullPipeline = async ({ description, num_candidates }) => {
  const res = await fetch(`${AI_BASE_URL}/full-pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, num_candidates }),
  });
  if (!res.ok) throw new Error("Failed to run full pipeline");
  return res.json();
};


export const findCandidates = async ({ description, num_candidates }) => {
  const res = await fetch(`${AI_BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, num_candidates }),
  });
  if (!res.ok) throw new Error("Failed to find candidates");
  return res.json();
};
