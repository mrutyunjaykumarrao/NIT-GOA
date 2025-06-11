# GitHub Repository Setup Instructions

## 🔧 **Repository Configuration for Team Collaboration**

This guide will help you configure your GitHub repository for secure team collaboration while maintaining full control as the project owner.

---

## 📋 **Step-by-Step GitHub Setup**

### **Phase 1: Branch Protection Rules**

#### **1. Protect the Main Branch**

**Navigate to**: Repository → Settings → Branches → Add rule

```
Branch name pattern: main

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners
  ✅ Restrict pushes that create files larger than 100 MB

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  ✅ Status checks: (will be populated after first PR)

✅ Require conversation resolution before merging
✅ Require signed commits (optional, recommended)
✅ Require linear history (optional)
✅ Include administrators
  ✅ Apply rules to administrators (includes you)

❌ Allow force pushes
❌ Allow deletions
```

#### **2. Protect the Develop Branch**

**Navigate to**: Repository → Settings → Branches → Add rule

```
Branch name pattern: develop

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging

✅ Require conversation resolution before merging

❌ Include administrators (allows you to merge without PR if needed)
❌ Allow force pushes
❌ Allow deletions
```

---

### **Phase 2: Team Member Management**

#### **1. Add Collaborators**

**Navigate to**: Repository → Settings → Collaborators and teams

```
1. Click "Add people"
2. Enter team member's GitHub username or email
3. Select permission level: "Write"
4. Click "Add [username] to this repository"
5. Repeat for each team member
```

#### **Permission Levels Explained**

| Level | Can Do | Cannot Do |
|-------|--------|-----------|
| **Read** | View, clone, download | Push, create issues, PRs |
| **Triage** | Manage issues and PRs | Push to repository |
| **Write** | Push to non-protected branches, create PRs | Merge to protected branches |
| **Maintain** | Manage repository settings | Delete repository, change visibility |
| **Admin** | Full access | Only owners have this |

**Recommended**: Give team members **Write** access.

#### **2. Create CODEOWNERS File**

Create `.github/CODEOWNERS` to automatically request your review:

```
# Global code ownership - all files require your review
* @mrutyunjaykumarrao

# Specific areas can have additional reviewers
src/Views/ @mrutyunjaykumarrao
src/components/ @mrutyunjaykumarrao
package.json @mrutyunjaykumarrao
```

---

### **Phase 3: Issue and PR Templates**

#### **1. Create Issue Templates**

**Navigate to**: Repository → Settings → General → Features → Set up templates

Create these templates:

##### **Bug Report Template**
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
A clear and concise description of what you expected to happen.

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 💻 Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone X, Desktop]

## 📝 Additional Context
Add any other context about the problem here.
```

##### **Feature Request Template**
```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

## 🚀 Feature Description
A clear and concise description of what you want to happen.

## 💡 Motivation
Why is this feature needed? What problem does it solve?

## 📋 Detailed Design
How should this feature work? Include mockups if possible.

## 🧪 Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 📸 Mockups/Screenshots
If applicable, add mockups or reference screenshots.

## 📝 Additional Context
Add any other context or screenshots about the feature request here.
```

#### **2. Create Pull Request Template**

Create `.github/pull_request_template.md`:

```markdown
## 📋 Description
Brief description of what this PR accomplishes.

## 🔧 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI improvement
- [ ] ♻️ Code refactor
- [ ] ⚡ Performance improvement

## 🧪 Testing Checklist
- [ ] Code compiles without errors
- [ ] `npm start` runs successfully
- [ ] `npm run build` completes successfully
- [ ] No ESLint warnings
- [ ] Tested on desktop browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices
- [ ] No console errors in browser
- [ ] All existing functionality still works

## 📸 Screenshots (if applicable)
Add screenshots of UI changes here.

## 🔗 Related Issues
- Closes #(issue number)
- Fixes #(issue number)
- Related to #(issue number)

## 📝 Additional Notes
Any additional information, context, or notes for reviewers.

## ✅ Reviewer Checklist
- [ ] Code follows project style guidelines
- [ ] Changes are well documented
- [ ] No duplicate code
- [ ] Functions and variables have descriptive names
- [ ] Performance impact is acceptable
- [ ] Security considerations have been addressed
```

---

### **Phase 4: Repository Settings**

#### **1. General Settings**

**Navigate to**: Repository → Settings → General

```
Repository name: NIT-GOA
Description: Official website for National Institute of Technology Goa
Website: https://nit-goa-ac-in.web.app
Topics: react, website, education, nitgoa, college

✅ Issues
✅ Preserve this repository
✅ Projects
✅ Sponsorships
✅ Wikis
✅ Discussions (optional)

❌ Allow merge commits
✅ Allow squash merging
✅ Allow rebase merging

✅ Always suggest updating pull request branches
✅ Allow auto-merge
✅ Automatically delete head branches
```

#### **2. Security Settings**

**Navigate to**: Repository → Settings → Security & analysis

```
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
✅ Dependabot version updates
✅ Code scanning alerts
✅ Secret scanning alerts
```

---

### **Phase 5: Project Management Setup**

#### **1. Create Project Board**

**Navigate to**: Repository → Projects → New project

```
Project name: NIT Goa Development
Description: Track development progress and team assignments
Template: Team backlog

Columns:
- 📋 Backlog
- 🎯 To Do
- 👷 In Progress
- 👀 In Review
- ✅ Done
- 🚀 Deployed
```

#### **2. Create Labels**

**Navigate to**: Repository → Issues → Labels

```
Priority Labels:
🔴 priority: critical
🟠 priority: high
🟡 priority: medium
🟢 priority: low

Type Labels:
🐛 bug
✨ enhancement
📚 documentation
🔧 maintenance
❓ question
🚀 feature

Status Labels:
🚧 in progress
👀 needs review
⏸️ on hold
✅ ready to merge

Area Labels:
🎨 frontend
⚙️ backend
📱 mobile
🖥️ desktop
🧪 testing
```

---

### **Phase 6: Automation Setup**

#### **1. Create Workflow Files**

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint --if-present
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build project
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: build/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: nit-goa-28558
```

---

## ✅ **Verification Checklist**

After completing the setup, verify:

- [ ] Main branch is protected
- [ ] Develop branch is protected  
- [ ] Team members have Write access
- [ ] CODEOWNERS file is created
- [ ] Issue templates are available
- [ ] PR template is created
- [ ] Project board is set up
- [ ] Labels are created
- [ ] CI/CD workflow is configured
- [ ] Repository settings are optimized

---

## 🚨 **Important Notes**

### **Security Best Practices**
1. Never share repository secrets
2. Use environment variables for sensitive data
3. Enable two-factor authentication
4. Regularly review collaborator access
5. Monitor security alerts

### **Backup Strategy**
1. Repository is automatically backed up by GitHub
2. Consider periodic local backups
3. Document recovery procedures
4. Test restore processes

### **Monitoring**
1. Watch repository notifications
2. Review PR activity regularly
3. Monitor build status
4. Check security alerts weekly

---

**🎉 Your repository is now ready for team collaboration!**

Next steps:
1. Invite team members
2. Create initial issues/tasks
3. Set up first sprint in project board
4. Brief team on workflow
5. Start collaborative development!
