# Placement Prep AI Prompt Engineering

This document details the prompt variations tested for generating the personalized placement roadmap, including input/output examples, analysis, and the final chosen prompt.

## System Role Used
**System Prompt:** `You are a helpful assistant that outputs only valid JSON arrays.`

Throughout all tests, the model was primed with this system role (alongside the `response_format: { type: "json_object" }` flag) to strictly enforce JSON output without markdown wrappers or conversational filler. The main user prompt also begins with the persona: `You are an expert technical placement mentor. Create a realistic day-by-day placement preparation roadmap for a student.`

---

## Variation 1: Basic Unstructured Prompt

### Prompt
> You are an expert technical placement mentor. Create a study plan for a student preparing for Amazon. They have 30 days and 4 hours daily. Focus on DSA and System Design. Output as JSON.

### Example Input
- Target Company: Amazon
- Days: 30
- Hours: 4
- Focus: DSA, System Design

### Example Output (Truncated)
```json
{
  "plan": {
    "week1": ["Learn Arrays", "Learn Strings"],
    "week2": ["Learn Trees", "System Design Basics"]
  }
}
```

### Analysis
This prompt failed because the model chose its own arbitrary JSON structure (grouping by weeks instead of days) and lacked granular actionable tasks. The frontend couldn't predictably parse the varying structures into a day-by-day timeline.

---

## Variation 2: Structured JSON Template Prompt

### Prompt
> Create a 30-day placement preparation roadmap for Amazon. The student is a beginner, has 4 hours daily, and needs to focus on DSA.
> Return a JSON array where each object represents a day with properties: dayNumber, title, and tasks (array of strings).

### Example Input
- Target Company: Amazon
- Days: 30
- Hours: 4
- Level: Beginner
- Focus: DSA

### Example Output (Truncated)
```json
[
  {
    "dayNumber": 1,
    "title": "Introduction to DSA",
    "tasks": ["Read about Arrays", "Solve 2 Easy Array problems"]
  },
  {
    "dayNumber": 2,
    "title": "Strings Basics",
    "tasks": ["Read about Strings", "Solve String problems"]
  }
]
```

### Analysis
While better and parsable, the tasks were just plain strings. We needed discrete task objects with categories, estimated minutes, and priority levels so the application could award XP and accurately track individual task durations and completions.

---

## Variation 3: Strict Constraint-Based Schema (Final)

### Prompt
> You are an expert technical placement mentor. Create a realistic day-by-day placement preparation roadmap for a student.
> 
> Student Profile:
> - Target Company: Google
> - Role Type: product
> - Total Days Available: 15
> - Daily Hours Available: 4
> - Current Level: intermediate
> - Focus Areas: DSA, System Design
> - Weak Areas: Dynamic Programming
> 
> Instructions:
> 1. Generate EXACTLY 15 days of preparation.
> 2. Distribute topics logically. Focus more on weak areas and the selected role type.
> 3. Each day should have a title and a list of 2 to 5 actionable tasks.
> 4. Total estimated minutes for tasks each day should roughly equal 240 minutes.
> 5. Include mock test days periodically.
> 6. The output MUST be a valid JSON array of daily plan objects.
> 
> Output format (JSON):
> [
>   {
>     "dayNumber": 1,
>     "title": "String",
>     "isMockTestDay": false,
>     "isReviewDay": false,
>     "tasks": [
>       {
>         "title": "String",
>         "category": "DSA|Aptitude|CS Core|Projects|Resume|HR Interview|Mock Tests|Communication",
>         "estimatedMinutes": Number,
>         "priority": "low|medium|high",
>         "xpReward": Number
>       }
>     ]
>   }
> ]

### Example Input
(Same as profile in prompt)

### Example Output (Truncated)
```json
[
  {
    "dayNumber": 1,
    "title": "Dynamic Programming Fundamentals",
    "isMockTestDay": false,
    "isReviewDay": false,
    "tasks": [
      {
        "title": "Review Top-down vs Bottom-up approaches",
        "category": "DSA",
        "estimatedMinutes": 60,
        "priority": "high",
        "xpReward": 30
      },
      {
        "title": "Solve 3 medium DP problems on LeetCode",
        "category": "DSA",
        "estimatedMinutes": 180,
        "priority": "high",
        "xpReward": 50
      }
    ]
  }
]
```

### Which One Worked Best and Why
Variation 3 worked best because it acts as a strict contract between the AI and our frontend TypeScript models. By providing an exact JSON schema structure within the prompt, the model consistently outputs discrete, categorized task objects rather than generic text. The explicit mathematical constraints (like calculating total daily minutes) ensure the generated workload realistically matches the user's available study time. Finally, dynamically injecting the user's specific weak areas and focus areas resulted in highly personalized and actionable roadmaps.
