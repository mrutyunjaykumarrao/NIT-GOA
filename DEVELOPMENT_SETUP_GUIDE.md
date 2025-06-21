# Development Environment Setup Guide

## 🛠️ **Complete Setup for New Team Members**

This guide will help new team members set up their development environment for the NIT Goa website project.

---

## 📋 **Prerequisites**

> **⚠️ IMPORTANT: Repository Access Required**
> 
> Before starting, you must be added as a collaborator to the repository. Contact @mrutyunjaykumarrao to be added with **Write** permissions. Without this, you'll encounter permission errors during setup.

### **Required Software**

#### **1. Node.js & npm**

**Check if installed:**
```bash
node --version  # Should be 16+ (recommended: 18 LTS)
npm --version   # Should be 8+
```

**Install if needed:**
- **macOS with Homebrew:** `brew install node`
- **Windows:** Download from [nodejs.org](https://nodejs.org/) (choose LTS version)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### **2. Git**

**Check if installed:**
```bash
git --version
```

**Install if needed:**
- **macOS:** Git comes with Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- **Windows:** Download from [git-scm.com](https://git-scm.com/)
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt-get install git
  ```

#### **3. Code Editor (Recommended: VS Code)**
- Download from: https://code.visualstudio.com/
- Alternative: WebStorm, Sublime Text, Atom

#### **4. GitHub CLI (Optional but helpful)**

> **Do I need this?** No, GitHub CLI is completely optional! You can do everything through VS Code and the web browser. It just makes some tasks faster from the command line.

**What it does:**
- Create pull requests from terminal: `gh pr create`
- View repository info: `gh repo view`
- Clone repos faster: `gh repo clone username/repo`

**Check if you have it:**
```bash
gh --version
```

**Install if you want it (optional):**
- **macOS with Homebrew:**
  ```bash
  brew install gh
  ```
- **Windows:** Download from [GitHub CLI releases](https://github.com/cli/cli/releases) or use winget:
  ```cmd
  winget install --id GitHub.cli
  ```
- **Linux:** See [installation guide](https://github.com/cli/cli/blob/trunk/docs/install_linux.md)

**Skip this if you prefer using VS Code and GitHub website!**

---

## 🚀 **Project Setup**

### **Step 1: Clone the Repository**

#### **For macOS/Linux:**
```bash
# Navigate to your workspace directory
cd ~/Developer  # or wherever you keep projects

# Clone the repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git

# Navigate to project directory
cd NIT-GOA

# CRITICAL: Switch to develop branch immediately
# The main branch is protected and will cause permission issues
git checkout develop

# Verify you're in the right place and on develop branch
git branch  # Should show * develop
ls -la     # Should see package.json, src/, public/, etc.
```

#### **For Windows (Command Prompt or PowerShell):**
```cmd
# Navigate to your workspace directory
cd C:\Users\%USERNAME%\Documents\Projects  # or wherever you keep projects
# Alternative: cd %USERPROFILE%\Documents\Projects

# Clone the repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git

# Navigate to project directory
cd NIT-GOA

# CRITICAL: Switch to develop branch immediately
# The main branch is protected and will cause permission issues
git checkout develop

# Verify you're in the right place and on develop branch
git branch  # Should show * develop
dir        # Should see package.json, src/, public/, etc.
```

### **Step 2: Install Dependencies**
```bash
# Install all project dependencies
npm install

# This might take a few minutes...
# You should see node_modules/ folder created
```

### **Step 3: Create Your Development Branch**
```bash
# You should already be on develop branch from Step 1
# Verify you're on develop
git branch  # Should show * develop

# Pull latest changes
git pull origin develop

# Create your personal development branch
# Replace 'yourname' with your actual name
git checkout -b feature/yourname/initial-setup

# Push your branch to GitHub
git push -u origin feature/yourname/initial-setup
```

### **Step 4: Environment Configuration**

#### **For macOS/Linux:**
```bash
# Check if .env.example exists
ls -la | grep env

# If it exists, copy it to create your local environment file
cp .env.example .env.local

# Edit the file if needed (add any local API keys, etc.)
```

#### **For Windows:**
```cmd
# Check if .env.example exists
dir | findstr env

# If it exists, copy it to create your local environment file
copy .env.example .env.local

# Edit the file if needed (add any local API keys, etc.)
```

### **Step 5: Start Development Server**
```bash
# Start the development server
npm start

# This should:
# 1. Compile the project
# 2. Open your browser to http://localhost:3000
# 3. Show the NIT Goa website
```

### **Step 6: Test Build Process**
```bash
# Test production build
npm run build

# Should create 'build/' directory with optimized files
# Should complete without errors
```

---

## 🔧 **VS Code Setup & Extensions**

### **Recommended Extensions**

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint", 
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "GitHub.vscode-pull-request-github",
    "eamodio.gitlens",
    "ms-vscode.live-server"
  ]
}
```

**Note:** Removed `bradlc.vscode-tailwindcss` as this project uses custom CSS, not Tailwind.

### **VS Code Settings**
Create `.vscode/settings.json` in the project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n"
}
```

### **Prettier Configuration**
Create `.prettierrc` in project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## 📂 **Project Structure Overview**

```
NIT-GOA/
├── 📁 public/                 # Static assets
│   ├── index.html            # Main HTML template
│   ├── favicon.ico           # Website icon
│   └── manifest.json         # PWA configuration
│
├── 📁 src/                   # Source code
│   ├── 📁 Views/             # Page components (18 pages)
│   │   ├── HomePage.js       # Main landing page
│   │   ├── About.js          # About NIT Goa
│   │   ├── Admissions.js     # Admission information
│   │   ├── Research.js       # Research activities
│   │   ├── Faculty.js        # Faculty directory
│   │   └── ...               # Other pages
│   │
│   ├── 📁 components/        # Reusable components
│   │   ├── MainNavigation/   # Navigation overlay
│   │   ├── Navbar/           # Header navigation
│   │   └── Footer/           # Page footer
│   │
│   ├── 📁 assets/            # Images, fonts, etc.
│   │   └── images/           # Project images
│   │
│   ├── 📁 utils/             # Utility functions
│   │   └── navigationConfig.js # Navigation configuration
│   │
│   ├── App.js                # Main app component
│   ├── App.css               # Main app styles
│   └── index.js              # Entry point
│
├── 📁 build/                 # Production build (auto-generated)
├── 📄 package.json           # Dependencies and scripts
├── 📄 README.md              # Project documentation
└── 📄 firebase.json          # Firebase hosting config
```

---

## 🔄 **Daily Development Workflow**

### **Starting Your Work Day**
```bash
# 1. Pull latest changes from develop
git checkout develop
git pull origin develop

# 2. Create a new feature branch for today's work
git checkout -b feature/yourname/feature-description

# 3. Start development server
npm start
```

### **Making Changes**
```bash
# 1. Make your changes to files
# 2. Test in browser (auto-refreshes)
# 3. Check for errors in console

# 4. Stage and commit changes
git add .
git commit -m "feat: add mobile navigation menu"

# 5. Push to your branch
git push origin feature/yourname/feature-description
```

### **Creating a Pull Request**
```bash
# 1. Push your final changes
git push origin feature/yourname/feature-description

# 2. Go to GitHub repository
# 3. Click "Compare & pull request"
# 4. Set base branch to "develop"
# 5. Fill out PR template
# 6. Create pull request
```

### **After PR is Merged**
```bash
# 1. Switch back to develop
git checkout develop

# 2. Pull the updated develop branch
git pull origin develop

# 3. Delete your old feature branch
git branch -d feature/yourname/old-feature
git push origin --delete feature/yourname/old-feature
```

---

## 🧪 **Testing Your Changes**

### **Manual Testing Checklist**
```
Desktop Testing:
□ Chrome (latest)
□ Firefox (latest)  
□ Safari (if on macOS)
□ Edge (if on Windows)

Mobile Testing:
□ Chrome mobile
□ Safari mobile
□ Responsive design mode in browser

Functionality Testing:
□ Navigation works
□ All links work
□ Forms submit properly
□ Images load correctly
□ No console errors
□ Page loads fast
```

### **Automated Testing**
```bash
# Run linting (code quality check)
npm run lint

# Fix auto-fixable lint issues
npm run lint -- --fix

# Run tests (if available)
npm test

# Run build test
npm run build
```

---

## 🐛 **Common Issues & Solutions**

### **Repository Access Issues**

#### **For macOS/Linux:**
```bash
# If you see "all files deleted" in VS Code after cloning:
# This means you don't have proper repository access

# Solution 1: Make sure you're added as collaborator
# Contact @mrutyunjaykumarrao to add you with Write permissions

# Solution 2: Delete broken clone and start fresh
rm -rf NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop

# Solution 3: If still having issues, use develop branch directly
git clone -b develop https://github.com/mrutyunjaykumarrao/NIT-GOA.git
```

#### **For Windows:**
```cmd
# If you see "all files deleted" in VS Code after cloning:
# This means you don't have proper repository access

# Solution 1: Make sure you're added as collaborator
# Contact @mrutyunjaykumarrao to add you with Write permissions

# Solution 2: Delete broken clone and start fresh
rmdir /s NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop

# Solution 3: If still having issues, use develop branch directly
git clone -b develop https://github.com/mrutyunjaykumarrao/NIT-GOA.git
```

### **Permission Errors on Main Branch**

#### **For macOS/Linux:**
```bash
# If you get permission errors, you're probably on main branch
# Main branch is protected - switch to develop immediately

git checkout develop
git pull origin develop

# If that fails, delete and re-clone:
cd ..
rm -rf NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop
```

#### **For Windows:**
```cmd
# If you get permission errors, you're probably on main branch
# Main branch is protected - switch to develop immediately

git checkout develop
git pull origin develop

# If that fails, delete and re-clone:
cd ..
rmdir /s NIT-GOA
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA
git checkout develop
```

### **Node/npm Issues**

#### **For macOS/Linux:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update npm
npm install -g npm@latest
```

#### **For Windows:**
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
del package-lock.json
npm install

# Update npm
npm install -g npm@latest
```

### **Git Issues**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout -- .

# Update branch with latest develop
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop
```

### **Development Server Issues**

#### **For macOS/Linux:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Start fresh
npm start
```

#### **For Windows:**
```cmd
# Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID from the output, then:
taskkill /PID <PID_NUMBER> /F

# Start fresh
npm start
```

---

## 📚 **Learning Resources**

### **React & JavaScript**
- [React Official Documentation](https://reactjs.org/docs)
- [Modern JavaScript (ES6+)](https://javascript.info/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

### **Git & GitHub**
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

### **CSS & Styling**
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## 🆘 **Getting Help**

### **When You're Stuck**
1. **Check the documentation** (README, guides)
2. **Search existing issues** on GitHub
3. **Ask in team chat** or discussions
4. **Create an issue** if it's a bug
5. **Tag @mrutyunjaykumarrao** for urgent help

### **Best Practices for Asking Help**
- Provide clear description of the problem
- Include error messages
- Share screenshots if relevant
- Mention what you've already tried
- Include your environment details

---

## ✅ **Setup Verification**

Run through this checklist to ensure everything is working:

```bash
# 1. Dependencies installed
npm list --depth=0

# 2. Development server starts
npm start
# Should open http://localhost:3000

# 3. Build works
npm run build
# Should create build/ folder

# 4. Git is configured
git config user.name
git config user.email

# 5. Your branch exists
git branch -a | grep yourname
```

---

**🎉 Congratulations! Your development environment is ready!**

You can now start contributing to the NIT Goa website project. Remember to follow the team workflow and don't hesitate to ask for help when needed!
