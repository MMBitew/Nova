# ✨ Nova - Learn at Your Own Pace

**Nova** is a skill-building learning app designed for teens and young adults (ages 13-21) who learn differently. The app focuses on practical academic and life skills presented in a respectful, modern, and confidence-building way.

---

## 🎯 **Project Overview**

**Target Users:** Teens 13-21 with learning differences  
**Approach:** Montessori-style (See → Try → Feedback)  
**Philosophy:** Teen-friendly, not childish. Empowering, not remedial.

---

## 📚 **Current Skills**

### **Note Master** (Core 60 Complete + Bonus 90 Planned)
Complete note-taking training system:
- 15 core lessons
- 30 practice activities
- 10 reviews
- 5 real-world challenges
- Linear, auto-guided flow
- **~2 hours of focused skill-building**

---

## 🏗️ **Architecture**

### **Data-Driven Content System**
All learning content stored as JSON files:
```
data/content/note-master/
├── skill.json (structure & progression)
├── lessons/ (15 files)
├── practice/ (30 files)
├── reviews/ (10 files)
└── challenges/ (5 files)
```

### **Linear Navigation**
Zero-decision-fatigue experience:
- Auto-starts at right place
- Auto-advances on completion
- Auto-resumes where user left off
- Clear progress always visible
- No menus, no navigation overhead

---

## 🎨 **Design Principles**

1. **Teen-Friendly** - Modern, not childish (like Elevate/Notion)
2. **Minimal Words** - 1-3 word labels, icons over text
3. **No Therapy Language** - Respectful, empowering tone
4. **Learning by Doing** - Montessori: See → Try → Feedback
5. **Micro-Lessons** - 2-3 minutes, one skill per lesson
6. **Low Cognitive Load** - One task per screen
7. **Audio Support** - Text-to-speech throughout
8. **Progress Visible** - "Step X of 60" always shown

---

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/nova.git
cd nova
```

### **2. Open in Browser**
```bash
# Option A: Python server
python3 -m http.server 8000

# Option B: Node server
npx serve

# Option C: Just open index.html
open index.html
```

### **3. Start Learning**
- Open app
- Tap "Note Master"
- Automatically starts at Lesson 1
- Complete → Auto-advances
- Progress saved automatically

---

## 📂 **Project Structure**

```
nova/
├── index.html              # Main entry point
├── css/
│   ├── reset.css          # CSS reset
│   ├── variables.css      # Nova design tokens
│   ├── core.css           # Layout & structure
│   ├── components.css     # UI components
│   ├── themes.css         # Color themes
│   └── linear-progress.css # Progress bars
├── js/
│   ├── core/              # Core systems
│   │   ├── state.js       # State management
│   │   ├── storage.js     # localStorage wrapper
│   │   ├── router.js      # Navigation
│   │   ├── content-loader.js    # JSON loader
│   │   ├── lesson-renderer.js   # Renders lessons
│   │   └── linear-navigation.js # Auto-guided flow
│   ├── components/        # Reusable UI
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── audio.js
│   ├── systems/           # App systems
│   │   ├── gamification.js
│   │   ├── progress.js
│   │   └── analytics.js
│   ├── content/           # Skill modules
│   │   └── note-master/
│   └── app.js             # App initialization
├── data/
│   └── content/
│       └── note-master/   # Note Master content
│           ├── skill.json
│           ├── lessons/   (15 files)
│           ├── practice/  (30 files)
│           ├── reviews/   (10 files)
│           └── challenges/ (5 files)
└── assets/
    ├── icons/
    ├── sounds/
    └── images/
```

---

## 🎓 **Evidence-Based Design**

### **Cognitive Load Theory**
- One concept per step
- 2-3 minute lessons
- Progressive complexity

### **Spaced Repetition**
- Reviews after 1 day, 3 days, 1 week
- Mixed practice in reviews

### **Active Learning**
- Students create, not copy
- Immediate feedback
- Multiple attempts allowed

### **Dual Coding**
- Visual + verbal
- Symbols + text
- Examples + rules

### **Metacognition**
- Explicit strategy instruction
- Self-assessment opportunities
- "Why this works" explanations

---

## 🎯 **XP & Progression**

### **XP System**
- Lesson: 20 XP
- Practice: 10 XP
- Review: 15 XP
- Challenge: 50 XP

**Total Core 60:** 1,020 XP

### **Badges**
- Block completion badges (5)
- Weekly milestone badges (3)
- Review perfection badges (5)
- Challenge mastery badges (5)

**Total:** 18 possible badges

---

## 🔧 **Development**

### **Adding New Lessons**
1. Create lesson JSON in `data/content/note-master/lessons/`
2. Follow existing schema (see L01-why-notes-work.json)
3. Create 2 practice files in `practice/`
4. Update `skill.json` sequence

### **Adding New Skills**
1. Copy `data/content/note-master/` structure
2. Create new skill folder (e.g., `reading-master/`)
3. Create skill.json with progression
4. Build lessons following same patterns
5. Create module in `js/content/`

---

## 📊 **Analytics**

Local-only analytics (no external services):
- Lesson completion rates
- Time spent per lesson
- XP earned over time
- Streak tracking
- Badge achievements

**Data export:** `localStorage` → JSON export function available

---

## 🎨 **Customization**

### **Themes**
Users can choose from 4 themes:
- Power Mode (Nova Purple - default)
- Chill Vibes (Warm Orange)
- Focus Zone (Cool Blue)
- Party Time (Deep Pink)

### **Audio**
- Text-to-speech on all content
- Can be toggled on/off
- Reads screen content on demand

---

## 🚢 **Deployment**

### **GitHub Pages (Recommended)**
```bash
# Push to GitHub
git push origin main

# Enable GitHub Pages
# Settings → Pages → main branch → root → Save

# Access at: https://YOUR_USERNAME.github.io/nova/
```

### **Netlify**
```bash
# Connect GitHub repo
# Build settings: none (static site)
# Publish directory: /
```

### **Custom Domain**
- Purchase domain
- Configure DNS
- Add CNAME file

---

## 📱 **Browser Support**

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🐛 **Troubleshooting**

### **Progress not saving**
- Check localStorage is enabled
- Check browser privacy settings
- Clear cache and retry

### **Lessons not loading**
- Check console for errors
- Verify JSON files in `data/content/`
- Check network tab for 404s

### **Auto-advance not working**
- Verify linear-navigation.js is loaded
- Check console for errors
- Verify skill.json has sequence array

---

## 📄 **License**

MIT License - See LICENSE file

---

## 🤝 **Contributing**

This is a focused educational project for specific users. If you'd like to contribute:
1. Understand the target audience (teens 13-21 with learning differences)
2. Follow design principles (teen-friendly, minimal words, no therapy language)
3. Maintain evidence-based pedagogy
4. Submit PRs with clear descriptions

---

## 📞 **Support**

For questions or issues:
- Create GitHub issue
- Check documentation in `/docs`
- Review INTEGRATION-GUIDE.md

---

## 🙏 **Acknowledgments**

Built with evidence-based learning science principles:
- Cognitive Load Theory (Sweller)
- Spaced Repetition (Ebbinghaus)
- Active Learning (Freeman et al.)
- Dual Coding (Paivio)
- Metacognition (Flavell)

Inspired by: Duolingo, Elevate, Khan Academy, Headspace

---

**✨ Nova - Helping teens build skills, gain confidence, and shine bright**
