# REFINED LESSON SCHEMA
# Introduce → Ask → Evaluate → Adapt

## Core Principles

1. **Immediate Interaction** - Ask within 15-30 seconds
2. **Minimal Text** - Visual-first, text-second
3. **Instant Feedback** - No waiting for validation
4. **Adaptive Flow** - System decides next step based on performance

---

## Lesson Structure

### Step 1: INTRODUCE (15-30 seconds)
**Goal:** Show the concept visually with minimal text

```json
{
  "stepId": "introduce",
  "type": "visual-intro",
  "maxDuration": 30,
  "content": {
    "visual": {
      "type": "diagram" | "animation" | "example",
      "src": "path/to/visual.svg"
    },
    "text": "Main idea = the big point",
    "subtext": "Every paragraph has one big idea",
    "icon": "🎯",
    "audio": "The main idea is the most important point in a paragraph"
  }
}
```

**Design:**
- Large visual (60% of screen)
- 1 sentence title (5-8 words max)
- 1 sentence subtext (optional, 8-12 words)
- Auto-advance after 15s OR user taps Continue

---

### Step 2: ASK (Immediate interaction)
**Goal:** Engage immediately with low-pressure question

```json
{
  "stepId": "ask",
  "type": "question",
  "difficultyLevel": "adaptive",
  "content": {
    "prompt": "Which is the main idea?",
    "format": "multiple-choice" | "tap-word" | "drag-drop",
    "options": [
      {
        "id": "a",
        "text": "Dogs are popular pets",
        "isCorrect": true,
        "explanation": "Yes! This is the big point."
      },
      {
        "id": "b", 
        "text": "Dogs need daily walks",
        "isCorrect": false,
        "explanation": "This is a detail, not the main idea."
      },
      {
        "id": "c",
        "text": "Dogs bark loudly",
        "isCorrect": false,
        "explanation": "This is a detail, not the main idea."
      }
    ],
    "context": {
      "text": "Dogs are popular pets. They need daily walks. They bark loudly. Many people love dogs.",
      "highlight": false
    }
  }
}
```

**Design:**
- Clear prompt (question)
- Context if needed (paragraph/sentence)
- 2-4 options (never more than 4)
- Large tap targets
- No time pressure

---

### Step 3: EVALUATE (Instant feedback)
**Goal:** Immediate response with encouragement

```json
{
  "stepId": "evaluate",
  "type": "instant-feedback",
  "responses": {
    "correct": {
      "message": "Yes! 🎯",
      "explanation": "That's the big point of the paragraph",
      "visual": "checkmark-animation",
      "audio": "Correct! That's the main idea",
      "nextAction": "advance"
    },
    "incorrect": {
      "message": "Not quite",
      "explanation": "The main idea is: Dogs are popular pets",
      "hint": "Look for the sentence that covers everything",
      "visual": "gentle-shake",
      "audio": "Let's try again. The main idea is the biggest point",
      "nextAction": "retry" | "scaffold" | "simplify"
    }
  },
  "adaptiveLogic": {
    "ifCorrect": "increase-difficulty",
    "ifIncorrect": "decrease-difficulty",
    "maxRetries": 2,
    "afterMaxRetries": "show-answer-and-explain"
  }
}
```

**Design:**
- Instant (no delay)
- Positive tone (even when wrong)
- Show correct answer if struggling
- Visual feedback (animation)
- Audio reinforcement

---

### Step 4: ADAPT (Automatic next step)
**Goal:** System chooses next activity based on performance

```json
{
  "stepId": "adapt",
  "type": "adaptive-routing",
  "logic": {
    "performance": "tracked-from-step-2",
    "routes": {
      "first-try-correct": {
        "action": "advance",
        "next": "harder-example",
        "message": "Great! Let's try a harder one"
      },
      "second-try-correct": {
        "action": "reinforce",
        "next": "similar-example",
        "message": "Good! One more to practice"
      },
      "max-retries-reached": {
        "action": "simplify",
        "next": "easier-example",
        "message": "Let's try an easier one"
      },
      "consistent-correct": {
        "action": "complete-concept",
        "next": "next-session",
        "message": "You've got it! ⭐"
      }
    }
  }
}
```

**System decides:**
- Harder example if doing well
- Same difficulty if struggling slightly  
- Easier example if struggling significantly
- Move to next concept if mastered (3+ correct)

---

## Question Difficulty Levels

### Easy (Level 1)
- Obvious correct answer
- Clear wrong answers
- Short context (1-2 sentences)
- Example: "Dogs are pets. Which is the main idea? [Dogs are pets]"

### Medium (Level 2)
- Less obvious correct answer
- Plausible wrong answers
- Medium context (3-4 sentences)
- Example: "Dogs make great pets. They are loyal. They protect homes. What's the main idea? [Dogs make great pets]"

### Hard (Level 3)
- Subtle correct answer
- Very plausible wrong answers
- Longer context (5+ sentences)
- Requires inference

---

## Complete Lesson Flow Example

```
User starts lesson
  ↓
INTRODUCE (30s)
  Visual: Diagram showing main idea vs details
  Text: "Main idea = the big point"
  [Auto-advance or tap Continue]
  ↓
ASK (Question 1 - Easy)
  "Which is the main idea?"
  Context: "Cats are popular pets..."
  [User taps answer]
  ↓
EVALUATE
  Correct! → "Yes! 🎯"
  ↓
ADAPT
  Performance: First-try correct
  System decides: Advance to harder example
  ↓
ASK (Question 2 - Medium)
  "Which is the main idea?"
  Context: "Exercise improves health. It strengthens..."
  [User taps answer]
  ↓
EVALUATE
  Incorrect → "Not quite. Let's look again."
  ↓
ADAPT  
  Performance: Incorrect on Q2
  System decides: Give same question with hint
  ↓
ASK (Question 2 - With Hint)
  "Which sentence talks about everything else?"
  [User taps answer]
  ↓
EVALUATE
  Correct! → "Yes! That's it!"
  ↓
ADAPT
  Performance: Second-try correct  
  System decides: One more at same level
  ↓
ASK (Question 3 - Medium)
  [Another similar question]
  ↓
EVALUATE + ADAPT
  ↓
COMPLETE
  "Great work! You've practiced main ideas 🎯"
  Schedule: Review in 1 day
```

---

## Session Completion Criteria

**Mastery (move to next concept):**
- 3+ questions correct
- At least 2 at medium difficulty
- First-try correct on at least 2

**Needs More Practice (schedule review):**
- 2-3 questions correct
- Needed hints or retries
- Schedule review: 12-24 hours

**Struggling (simplify next time):**
- Less than 2 correct
- Multiple retries needed
- Schedule review: 4-8 hours
- Use easier examples next session

---

## Key Differences from Current System

| Current | Refined |
|---------|---------|
| 7 step cards before interaction | Interaction after 30 seconds |
| All users see same content | Content adapts to performance |
| Linear progression | Adaptive difficulty |
| One-and-done | Spaced repetition built-in |
| Text-heavy explanations | Visual-first, minimal text |
| User chooses practice | System chooses automatically |

---

## Implementation Notes

1. **Questions per session:** 3-6 (adaptive)
2. **Total time:** 3-10 minutes  
3. **Success metric:** 70%+ correct
4. **Review trigger:** Performance-based
5. **Advancement:** Mastery-based, not time-based
