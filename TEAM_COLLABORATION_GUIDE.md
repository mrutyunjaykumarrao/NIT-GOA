# NIT Goa Project - Team Collaboration Guide

## 👥 **Team Structure & Roles**

**Project Owner**: Mrutyunjay Kumar Rao (@mrutyunjaykumarrao)  
**Team Size**: 5 developers total (1 owner + 4 new members)  
**Repository**: https://github.com/mrutyunjaykumarrao/NIT-GOA  
**Live Website**: https://nit-goa-ac-in.web.app  

### **Role Distribution**

#### **Project Owner (You)**
- ✅ Final approval on all PRs to `main` branch
- ✅ Deployment management & production releases
- ✅ Architecture decisions & code reviews
- ✅ Team coordination & project planning
- ✅ Stakeholder communication

#### **Team Member Roles (To Be Assigned)**
- **Developer 1**: Content & About Pages (about, contact, academic calendar)
- **Developer 2**: Academic Features (admissions, courses, academic programs)
- **Developer 3**: Research & Faculty (research pages, faculty profiles, publications)
- **Developer 4**: Infrastructure & Admin (facilities, admin pages, performance optimization)

---

## 🌳 **Git Branch Strategy**

### **Protected Branches**
```
main (production)     ← Only you can merge here
├── develop           ← Integration branch for testing
├── staging           ← Pre-production testing
└── hotfix/*          ← Emergency fixes
```

### **Personal Development Branches**
```
feature/mrutyunjay/*     ← Your development area
feature/developer1/*     ← Team member 1 workspace
feature/developer2/*     ← Team member 2 workspace  
feature/developer3/*     ← Team member 3 workspace
feature/developer4/*     ← Team member 4 workspace
```

### **Branch Naming Convention**
```
feature/[name]/[feature-description]
fix/[name]/[bug-description]
docs/[name]/[documentation-update]
style/[name]/[ui-improvement]
```

**Examples:**
- `feature/john/mobile-navigation`
- `fix/sarah/header-alignment-issue`
- `docs/mike/api-documentation`

---

## 🔒 **Security & Protection Rules**

### **Main Branch Protection**
- ✅ Require pull request reviews (minimum 1)
- ✅ Require your approval specifically
- ✅ Require status checks to pass (build success)
- ✅ Require branches to be up to date before merging
- ✅ Restrict direct pushes to main
- ✅ Include administrators in restrictions

### **Develop Branch Protection**
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Allow team members to merge after review

---

## 🚀 **Development Workflow**

### **For New Team Members - Initial Setup**
```bash
# 1. Clone the repository
git clone https://github.com/mrutyunjaykumarrao/NIT-GOA.git
cd NIT-GOA

# 2. Install dependencies
npm install

# 3. Create your personal development branch
git checkout develop
git checkout -b feature/yourname/initial-setup
git push -u origin feature/yourname/initial-setup

# 4. Test the setup
npm start  # Should open http://localhost:3000
npm run build  # Should build successfully
```

### **Daily Development Process**
```bash
# 1. Start with latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/yourname/feature-description

# 3. Make your changes
# ... develop your feature ...

# 4. Test locally
npm start  # Test in browser
npm run build  # Ensure build works

# 5. Commit with semantic message
git add .
git commit -m "feat: add responsive navigation menu"

# 6. Push your branch
git push -u origin feature/yourname/feature-description

# 7. Create Pull Request to develop branch on GitHub
```

### **Before Creating Pull Request**
```bash
# Sync with latest develop
git checkout develop
git pull origin develop
git checkout feature/yourname/feature-description
git merge develop

# Resolve any conflicts
# Test everything still works
npm start && npm run build

# Push updated branch
git push origin feature/yourname/feature-description
```

---

## 📝 **Commit Message Convention**

Use semantic commit prefixes:

### **Types**
- `feat:` - New features or functionality
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - UI/CSS improvements (no logic changes)
- `refactor:` - Code restructuring (no behavior changes)
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance, build changes, dependencies

### **Examples**
```
feat: add mobile navigation dropdown
fix: resolve header alignment on mobile devices
docs: update README with new setup instructions
style: improve button hover animations
refactor: reorganize component file structure
perf: optimize image loading on homepage
test: add unit tests for navigation component
chore: update dependency versions
```

---

## 🔄 **Pull Request Process**

### **PR Title Format**
```
[Type] Brief description of changes

Examples:
feat: Add mobile navigation menu
fix: Resolve header alignment issue
docs: Update team collaboration guide
```

### **PR Description Template**
```markdown
## 📋 Description
Brief description of what this PR accomplishes.

## 🔧 Changes Made
- [ ] Added new component/feature
- [ ] Fixed existing issue
- [ ] Updated documentation
- [ ] Improved styling/UI
- [ ] Refactored code structure

## 🧪 Testing Checklist
- [ ] Tested on desktop browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices
- [ ] No console errors
- [ ] Build passes successfully (`npm run build`)
- [ ] No ESLint warnings

## 📸 Screenshots (if UI changes)
[Add screenshots here]

## 🔗 Related Issues
Closes #123
Fixes #456
```

### **Code Review Guidelines**

#### **For Reviewers**
- ✅ Check code quality and consistency
- ✅ Test functionality locally if needed
- ✅ Verify no breaking changes
- ✅ Ensure responsive design works
- ✅ Provide constructive feedback
- ✅ Approve when ready

#### **For Authors**
- ✅ Address all reviewer comments
- ✅ Test suggested changes
- ✅ Update PR when ready for re-review
- ✅ Resolve merge conflicts promptly

---

## 🎯 **Project Areas & Assignments**

### **Current Project Structure**
```
src/
├── Views/                    # Main page components (18 pages)
│   ├── HomePage.js          # ✅ Complete
│   ├── About.js             # 🎯 Developer 1
│   ├── Admissions.js        # 🎯 Developer 2
│   ├── Research.js          # 🎯 Developer 3
│   ├── Faculty.js           # 🎯 Developer 3
│   ├── Facilities.js        # 🎯 Developer 4
│   └── ... (other pages)
├── components/              # Shared components
│   ├── MainNavigation/      # ✅ Complete
│   ├── Footer/              # ✅ Complete
│   └── Navbar/              # ✅ Complete
└── utils/                   # Utility functions
```

### **Suggested Work Distribution**

#### **Developer 1 - Content & Information**
- About page enhancements
- Contact Us improvements
- Academic Calendar features
- Content management & updates
- Documentation improvements

#### **Developer 2 - Academic Features**
- Admissions page development
- Academic programs showcase
- Course information pages
- Student portal integration
- Academic regulations

#### **Developer 3 - Research & Faculty**
- Research showcase pages
- Faculty profile enhancements
- Publication management
- Research center information
- Collaboration showcases

#### **Developer 4 - Infrastructure & Performance**
- Facilities page improvements
- Administrative pages
- Performance optimization
- Security enhancements
- Build system improvements

---

## 📞 **Communication & Support**

### **GitHub Communication**
- **Issues**: Use for bug reports, feature requests
- **Discussions**: Use for questions and brainstorming
- **Pull Requests**: Use for code reviews
- **Project Board**: Track progress and assignments

### **Getting Help**
1. **Check Documentation**: README, guides, existing code
2. **Search Issues**: Look for similar problems
3. **Create Issue**: Describe problem clearly with screenshots
4. **Tag Owner**: Use @mrutyunjaykumarrao for urgent issues

### **Emergency Procedures**
- **Critical Bugs**: Tag owner immediately
- **Deployment Issues**: Contact owner directly
- **Broken Main Branch**: Stop all work, notify owner

---

## ✅ **Quality Standards**

### **Code Quality**
- ✅ Follow existing code style
- ✅ Write clean, readable code
- ✅ Add comments for complex logic
- ✅ Use semantic HTML
- ✅ Follow React best practices

### **Testing Requirements**
- ✅ Test on multiple browsers
- ✅ Verify mobile responsiveness
- ✅ Check for console errors
- ✅ Ensure build passes
- ✅ Test navigation and links

### **Performance Standards**
- ✅ Optimize images and assets
- ✅ Minimize bundle size impact
- ✅ Use efficient CSS and JavaScript
- ✅ Test page load times

---

## 🎉 **Success Metrics**

### **Individual Goals**
- ✅ Regular commits (at least 3 per week)
- ✅ Clean PR reviews (minimal feedback rounds)
- ✅ Zero breaking changes to main
- ✅ Responsive design compliance
- ✅ Documentation contributions

### **Team Goals**
- ✅ Weekly feature deliveries
- ✅ 100% test coverage on new features
- ✅ Zero production bugs
- ✅ Improved website performance
- ✅ Enhanced user experience

---

**🚀 Welcome to the team! Let's build an amazing NIT Goa website together!**
