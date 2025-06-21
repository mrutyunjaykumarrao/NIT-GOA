# Team Reference Guide - NIT Goa Project

## 🎯 **Quick Reference for Everyone**

---

## 👑 **For Project Owner (Mrutyunjay) - macOS with GitHub CLI**

### **📊 Daily Team Monitoring**

#### **Check Team Activity**
```bash
# See all pull requests
gh pr list

# See detailed PR info
gh pr view 123

# Check repository activity
gh repo view

# See all branches (including team member branches)
git branch -a
git fetch --all && git branch -a
```

#### **Review Team Work**
```bash
# Checkout team member's branch to test locally
gh pr checkout 123

# Quick PR approval
gh pr review 123 --approve --body "Looks good! 👍"

# Request changes
gh pr review 123 --request-changes --body "Please fix the navigation issue"

# Merge approved PR
gh pr merge 123 --squash  # or --merge or --rebase
```

#### **Repository Management**
```bash
# Create issues for team tasks
gh issue create --title "Add mobile navigation" --body "Create responsive menu for mobile devices"

# View all issues
gh issue list

# Close completed issues
gh issue close 45

# Add team members as collaborators (if needed)
gh api -X PUT repos/mrutyunjaykumarrao/NIT-GOA/collaborators/USERNAME --field permission=push
```

### **🔍 Advanced Monitoring**
```bash
# See commit history across all branches
git log --all --oneline --graph --decorate -10

# Check who committed what
git log --author="TeamMemberName" --oneline

# See file changes in a specific branch
git diff develop..team-member-branch

# Monitor specific files
git log --follow -- src/components/Navbar/Navbar.js
```

### **🚀 Quick Actions**
```bash
# Open repository in browser
gh repo view --web

# Open specific PR in browser  
gh pr view 123 --web

# Create PR from current branch
gh pr create --title "Feature: Add contact form" --body "Implements contact form with validation"

# Deploy to production (when ready)
npm run build && firebase deploy
```

---

## 👥 **For Team Members (Windows Users)**

### **📋 Essential Daily Commands**

#### **Starting Work (Windows)**
```cmd
# Navigate to project
cd C:\Users\%USERNAME%\Documents\Projects\NIT-GOA

# Get latest changes
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/yourname/task-description

# Start development
npm start
```

#### **Working on Features**
```cmd
# Check your current branch
git branch

# See what files you've changed
git status

# See specific changes
git diff

# Stage your changes
git add .

# Commit with good message
git commit -m "feat: add responsive navigation menu"

# Push your work
git push origin feature/yourname/task-description
```

#### **Creating Pull Requests**
1. **Push your branch**: `git push origin feature/yourname/task-description`
2. **Go to GitHub**: `https://github.com/mrutyunjaykumarrao/NIT-GOA`
3. **Click**: "Compare & pull request" (green button)
4. **Set base branch**: `develop` (not main!)
5. **Write description**: What you built and how to test it
6. **Create pull request**

### **🔧 Common Windows Troubleshooting**

#### **Port Issues (Windows)**
```cmd
# If npm start fails due to port 3000 being busy
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F

# Then try again
npm start
```

#### **Git Issues (Windows)**
```cmd
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all changes and start fresh
git checkout -- .

# Delete node_modules and reinstall (if npm issues)
rmdir /s node_modules
del package-lock.json
npm install
```

#### **Branch Management**
```cmd
# Switch to develop branch
git checkout develop

# Delete your old branch after PR is merged
git branch -d feature/yourname/old-task
git push origin --delete feature/yourname/old-task

# See all branches
git branch -a
```

---

## 🚨 **Emergency Fixes for Everyone**

### **"I Broke Something!" Recovery**

#### **Undo Last Commit (Keep Changes)**
```bash
git reset --soft HEAD~1
# Your changes are still there, just uncommitted
```

#### **Completely Start Over**
```bash
# macOS/Linux
rm -rf NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop

# Windows
rmdir /s NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop
```

#### **My Branch is Behind Develop**
```bash
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop
# Resolve any conflicts, then:
git add .
git commit -m "merge: resolve conflicts with develop"
```

---

## 📝 **Commit Message Guidelines**

### **Format**: `type: description`

**Types:**
- `feat:` New feature
- `fix:` Bug fix  
- `docs:` Documentation
- `style:` CSS/styling changes
- `refactor:` Code cleanup
- `test:` Adding tests

**Examples:**
```bash
git commit -m "feat: add responsive navigation menu"
git commit -m "fix: resolve mobile menu toggle issue"
git commit -m "style: update homepage hero section colors"
git commit -m "docs: update README with setup instructions"
```

---

## 🔄 **Workflow Cheat Sheet**

### **Perfect Team Workflow**

1. **Start**: `git checkout develop && git pull origin develop`
2. **Branch**: `git checkout -b feature/yourname/task`
3. **Work**: Make changes, test with `npm start`
4. **Save**: `git add . && git commit -m "feat: description"`
5. **Share**: `git push origin feature/yourname/task`
6. **Request**: Create PR on GitHub (base: develop)
7. **Wait**: Mrutyunjay reviews and merges
8. **Clean**: Delete old branch after merge

### **Daily Routine for Team Members**
```bash
# Morning (get latest changes)
git checkout develop
git pull origin develop

# During work (save frequently)
git add .
git commit -m "feat: work in progress"
git push origin your-branch

# End of day (create PR if ready)
# Go to GitHub and create Pull Request
```

---

## 🎨 **VS Code Tips**

### **Essential Extensions for Team**
- **ES7+ React/Redux/React-Native snippets**: Fast React components
- **Prettier**: Auto-format code
- **GitLens**: See git history in editor
- **Auto Rename Tag**: Update HTML tags together
- **Thunder Client**: Test APIs (if needed)

### **Useful VS Code Shortcuts**
- `Ctrl+Shift+P`: Command palette
- `Ctrl+```: Open terminal
- `Ctrl+Shift+G`: Source control panel
- `Alt+Shift+F`: Format document
- `Ctrl+D`: Select next occurrence
- `Ctrl+/`: Toggle comment

---

## 🐛 **Common Issues & Solutions**

### **"npm start doesn't work"**
1. `npm install` (reinstall dependencies)
2. Delete `node_modules` and run `npm install` again
3. Check if port 3000 is busy (see port issues above)
4. Restart VS Code

### **"Git says I have conflicts"**
1. Don't panic! 
2. Open the conflicted files in VS Code
3. Look for `<<<<<<< HEAD` markers
4. Choose which code to keep
5. Remove the conflict markers
6. `git add .` and `git commit`

### **"I can't see my teammate's branch"**
```bash
git fetch --all
git branch -a
# Now you should see all remote branches
```

### **"VS Code shows many changed files but I didn't change them"**
- You might be on the wrong branch
- Run: `git checkout develop`
- If still issues, contact Mrutyunjay

---

## 📞 **Getting Help**

### **Order of Help:**
1. **Check this guide first**
2. **Google the error message**
3. **Ask team in group chat**
4. **Create GitHub issue**
5. **Tag @mrutyunjaykumarrao for urgent help**

### **When Asking for Help, Include:**
- What you were trying to do
- The exact error message
- Screenshot (if helpful)
- Your operating system (Windows/Mac)
- What you already tried

---

## 🎯 **Project Specific Info**

### **Important Branches**
- `main`: ⛔ **Protected** - Don't push here!
- `develop`: ✅ **Your target** - Create PRs to this branch
- `feature/yourname/*`: ✅ **Your work** - Your feature branches

### **Project Structure Quick Reference**
```
src/
├── Views/          # Page components (HomePage.js, About.js, etc.)
├── components/     # Reusable components (Navbar, Footer)
├── assets/         # Images and static files
├── utils/          # Helper functions
├── App.js          # Main app component
└── index.js        # Entry point
```

### **Important Files**
- `package.json`: Dependencies and scripts
- `src/App.js`: Main application component
- `src/utils/navigationConfig.js`: Navigation structure
- `public/index.html`: Main HTML template

### **Available Scripts**
```bash
npm start          # Start development server (http://localhost:3000)
npm run build      # Create production build
npm test           # Run tests (if any)
```

---

## 🚀 **Quick Start for New Team Members**

### **First Time Setup**
1. **Get added as collaborator** by Mrutyunjay
2. **Accept GitHub invitation** (check email)
3. **Clone repo**: `git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git`
4. **Switch to develop**: `cd NIT-GOA && git checkout develop`
5. **Install dependencies**: `npm install`
6. **Test it works**: `npm start`
7. **Create your first branch**: `git checkout -b feature/yourname/initial-setup`

### **Your First Contribution**
1. **Make a small change** (like updating a comment)
2. **Commit it**: `git add . && git commit -m "docs: add my name to contributors"`
3. **Push it**: `git push origin feature/yourname/initial-setup`
4. **Create PR** on GitHub
5. **Wait for review** and merge

---

**🎉 Welcome to the NIT Goa website development team!**

**Remember**: We're here to learn and help each other. Don't be afraid to ask questions!
