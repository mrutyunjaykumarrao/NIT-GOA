# 🚀 Daily Quick Reference Card

> **💡 Quick Start**: Use this file for daily commands. For detailed explanations, troubleshooting, and learning, see [`TEAM_REFERENCE_GUIDE.md`](TEAM_REFERENCE_GUIDE.md)

## For Project Owner (Mrutyunjay)

### Monitor Team
```bash
gh pr list                    # See all PRs
gh pr view 123               # View specific PR
gh pr checkout 123           # Test team member's work
gh pr review 123 --approve   # Approve PR
gh pr merge 123 --squash     # Merge PR
```

### Repository Management
```bash
gh repo view --web           # Open repo in browser
gh issue create              # Create new task
git fetch --all              # Get all team branches
git branch -a                # See all branches
```

---

## For Team Members (Windows)

### Daily Workflow
```cmd
# 1. Start work
cd C:\Users\%USERNAME%\Documents\Projects\NIT-GOA
git checkout develop
git pull origin develop
git checkout -b feature/yourname/task-name

# 2. During work
npm start                    # Start development server
git add .                    # Stage changes
git commit -m "feat: description"
git push origin feature/yourname/task-name

# 3. Create PR
# Go to GitHub → Create Pull Request → Base: develop
```

### Emergency Fixes
```cmd
# Port 3000 busy
netstat -ano | findstr :3000
taskkill /PID <NUMBER> /F

# Start over completely  
rmdir /s NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop
npm install
```

---

## Common Commands (Everyone)

### Git Essentials
```bash
git status                   # See what changed
git branch                   # See current branch  
git checkout develop         # Switch to develop
git pull origin develop      # Get latest changes
git log --oneline -5         # See recent commits
```

### NPM Commands
```bash
npm install                  # Install dependencies
npm start                    # Start dev server
npm run build               # Build for production
```

### Commit Messages
```bash
feat: add new feature
fix: bug fix
style: CSS changes
docs: documentation
refactor: code cleanup
```

---

## 🆘 Emergency Contacts

**Daily commands**: This file (bookmark it!)
**Detailed help & troubleshooting**: Check [`TEAM_REFERENCE_GUIDE.md`](TEAM_REFERENCE_GUIDE.md)
**Setup problems**: Check [`DEVELOPMENT_SETUP_GUIDE.md`](DEVELOPMENT_SETUP_GUIDE.md)
**Simple workflow**: Check [`SIMPLE_TEAM_GUIDE.md`](SIMPLE_TEAM_GUIDE.md)
**Urgent issues**: Tag @mrutyunjaykumarrao on GitHub

---

**🎯 Remember**: Always work on `develop` branch, never `main`!
