# Simple Team Guide - NIT Goa Website

> **For 5-person team with beginners - Keep it simple!**

## 🎯 **Quick Overview**

**What we have:**
- ✅ Live website: https://nit-goa-ac-in.web.app
- ✅ Main branch protected (only Mrutyunjay can merge)
- ✅ Ready for team collaboration

**What you need to know:**
- 📝 Work in your own branch
- 🔄 Create Pull Requests to get your changes reviewed
- ✅ Wait for approval before your changes go live

---

## 📋 **For New Team Members**

### **Step 1: One-time Setup (15 minutes)**

```bash
# 1. Clone the project
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Install dependencies
npm install

# 3. Test that everything works
npm start
```

**If `npm start` works and opens http://localhost:3000, you're ready!**

### **Step 2: Create develop branch (if not exists)**

```bash
# Create develop branch from main
git checkout main
git checkout -b develop
git push -u origin develop
```

---

## 🚀 **Simple Daily Workflow**

### **Every time you want to work:**

```bash
# 1. Get latest changes
git checkout develop
git pull origin develop

# 2. Create your work branch
git checkout -b yourname-what-you-are-doing
# Example: git checkout -b john-fix-navbar

# 3. Work on your changes
# Edit files, test locally with: npm start

# 4. Save your work
git add .
git commit -m "describe what you did"

# 5. Share your work
git push origin yourname-what-you-are-doing
```

### **Then create Pull Request:**

1. Go to GitHub website
2. Click "Compare & pull request" 
3. **Important:** Make sure it's going to `develop` branch (not main)
4. Write what you did
5. Click "Create pull request"
6. Wait for Mrutyunjay to review

---

## 🔧 **GitHub Setup for Mrutyunjay**

### **Step 1: Create develop branch protection**

1. Go to GitHub → Settings → Branches → Add rule
2. Branch name pattern: `develop`
3. **Simple settings:**
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ❌ Everything else (keep it simple for now)

### **Step 2: Add team members**

1. Go to Settings → Collaborators
2. Click "Add people"
3. Give them "Write" permissions
4. They'll get an email invitation

---

## 🎯 **Simple Rules**

### **✅ DO:**
- Always work in your own branch (`yourname-feature`)
- Test your changes locally (`npm start`) before pushing
- Create PRs to `develop` branch
- Write clear commit messages
- Ask for help when stuck

### **❌ DON'T:**
- Never push directly to `main` or `develop`
- Don't work in someone else's branch
- Don't push broken code
- Don't be afraid to ask questions!

---

## 🏗️ **Branch Structure (Simple)**

```
main (protected)
├── develop (semi-protected) ← Team works here
│   ├── john-fix-navbar
│   ├── sara-add-footer
│   └── amit-update-content
```

**Flow:**
1. Team creates PRs to `develop`
2. Mrutyunjay reviews and merges to `develop`
3. When `develop` is stable, Mrutyunjay merges to `main`
4. Main gets deployed to live website

---

## 🚀 **Deployment (Manual - Mrutyunjay only)**

```bash
# When ready to deploy:
git checkout main
git merge develop
git push origin main

# Deploy to live website:
npm run build
firebase deploy
```

---

## 🧰 **Useful Commands**

```bash
# See what changed
git status

# See all branches
git branch -a

# Switch to different branch
git checkout branch-name

# Get latest updates
git pull origin develop

# If something goes wrong
git stash          # Save current work
git checkout develop
git pull origin develop
git stash pop      # Get your work back
```

---

## 🆘 **Getting Help**

### **Common Issues:**

**"Git says conflict"**
- Ask Mrutyunjay for help
- Usually means someone else changed the same file

**"npm start doesn't work"**
- Try: `rm -rf node_modules && npm install`
- Then: `npm start`

**"I broke something"**
- Don't panic! Git tracks everything
- Ask for help, nothing is permanently lost

**"I don't know what to work on"**
- Check GitHub Issues for tasks
- Ask Mrutyunjay for assignment

### **Contact:**
- **Project Owner:** @mrutyunjaykumarrao
- **Questions:** Create GitHub issue or ask directly
- **Urgent:** Message Mrutyunjay

---

## 🎉 **That's It!**

**No complex workflows, no complicated rules.**

**Just: Branch → Work → Push → PR → Review → Merge → Repeat!**

---

## 📚 **Reference Links**

- **Live Website:** https://nit-goa-ac-in.web.app
- **Repository:** https://github.com/mrutyunjaykumarrao/NIT-GOA
- **Local Development:** http://localhost:3000 (when running `npm start`)

**Remember: When in doubt, ask! Better to ask than break something.** 😊