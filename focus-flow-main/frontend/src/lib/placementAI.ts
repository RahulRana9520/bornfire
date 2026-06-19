import { PlacementProfile, DailyPlacementPlan, PlacementTask } from '@/types/placement';
import { generateId } from '@/lib/taskUtils';

export async function generateRoadmapAI(profile: PlacementProfile): Promise<DailyPlacementPlan[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is missing');
  }

  const prompt = `
You are an expert technical placement mentor. Create a realistic day-by-day placement preparation roadmap for a student.

Student Profile:
- Target Company: ${profile.targetCompany}
- Role Type: ${profile.roleType}
- Total Days Available: ${profile.daysAvailable}
- Daily Hours Available: ${profile.dailyHours}
- Current Level: ${profile.currentLevel}
- Focus Areas: ${profile.focusAreas.join(', ')}
- Weak Areas: ${profile.weakAreas.join(', ')}

Instructions:
1. Generate EXACTLY ${profile.daysAvailable} days of preparation.
2. Distribute topics logically across the days. Focus more on weak areas and the selected role type (e.g., more DSA for product, more Aptitude for service).
3. Each day should have a title and a list of 2 to 5 actionable tasks.
4. Total estimated minutes for tasks each day should roughly equal ${profile.dailyHours * 60} minutes.
5. Include mock test days periodically.
6. The output MUST be a valid JSON array of daily plan objects.

Output format (JSON):
[
  {
    "dayNumber": 1,
    "title": "String",
    "isMockTestDay": false,
    "isReviewDay": false,
    "tasks": [
      {
        "title": "String",
        "category": "DSA|Aptitude|CS Core|Projects|Resume|HR Interview|Mock Tests|Communication",
        "estimatedMinutes": Number,
        "priority": "low|medium|high",
        "xpReward": Number
      }
    ]
  }
]
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON arrays.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" } // Using json_object might require wrapping in an object, but we'll parse. Actually, let's just ask for json array in text, or wrap it.
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    let resultText = data.choices[0].message.content;
    
    // Sometimes OpenAI returns wrapped json like { "roadmap": [...] } if response_format is json_object. 
    // To be safe against markdown formatting:
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed: any;
    try {
      parsed = JSON.parse(resultText);
    } catch (e) {
      console.error("JSON parse error:", e, resultText);
      throw new Error("Failed to parse AI response as JSON");
    }

    const plansArray = Array.isArray(parsed) ? parsed : (parsed.roadmap || parsed.plan || Object.values(parsed)[0]);
    
    if (!Array.isArray(plansArray)) {
       throw new Error("Unexpected AI response format");
    }

    const startDate = new Date(profile.startDate);

    return plansArray.map((dayPlan: any, index: number) => {
      const planDate = new Date(startDate);
      planDate.setDate(startDate.getDate() + index);

      return {
        dayNumber: dayPlan.dayNumber || index + 1,
        date: planDate.toISOString(),
        title: dayPlan.title || `Day ${index + 1}`,
        isMockTestDay: !!dayPlan.isMockTestDay,
        isReviewDay: !!dayPlan.isReviewDay,
        tasks: (dayPlan.tasks || []).map((t: any) => ({
          id: generateId(),
          title: t.title || "Study Task",
          category: t.category || "General",
          estimatedMinutes: t.estimatedMinutes || 60,
          completed: false,
          priority: t.priority || "medium",
          xpReward: t.xpReward || 30
        }))
      };
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
