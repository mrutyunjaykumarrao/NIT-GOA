# GitHub Repository Configuration Guide

## Overview
This guide provides step-by-step instructions for configuring the NIT Goa website repository for team collaboration with proper security and workflow management.

## Prerequisites
- Repository owner/admin access to the GitHub repository
- GitHub account with appropriate permissions
- Understanding of Git branching strategies

## 1. Branch Protection Rules Setup

### Main Branch Protection
1. Navigate to **Settings** → **Branches** in your GitHub repository
2. Click **Add rule** and configure:
   - **Branch name pattern**: `main`
   - **Protect matching branches**: ✅ Enabled
   - **Require a pull request before merging**: ✅ Enabled
     - **Require approvals**: 1 (minimum)
     - **Dismiss stale reviews**: ✅ Enabled
     - **Require review from code owners**: ✅ Enabled
   - **Require status checks to pass**: ✅ Enabled
     - **Require up-to-date branches**: ✅ Enabled
     - Add status checks: `lint-and-test`
   - **Require conversation resolution**: ✅ Enabled
   - **Require signed commits**: ✅ Enabled (recommended)
   - **Require linear history**: ✅ Enabled
   - **Restrict pushes**: ✅ Enabled
     - Add: Repository administrators only

### Develop Branch Protection
1. Click **Add rule** and configure:
   - **Branch name pattern**: `develop`
   - **Protect matching branches**: ✅ Enabled
   - **Require a pull request before merging**: ✅ Enabled
     - **Require approvals**: 1 (minimum)
   - **Require status checks to pass**: ✅ Enabled
     - **Require up-to-date branches**: ✅ Enabled
   - **Require conversation resolution**: ✅ Enabled

## 2. Team Member Management

### Adding Collaborators
1. Navigate to **Settings** → **Manage access**
2. Click **Invite a collaborator**
3. Add each team member with **Write** permissions:
   - Developer 1: [Email/Username]
   - Developer 2: [Email/Username]
   - Developer 3: [Email/Username]
   - Developer 4: [Email/Username]

### Permission Levels
- **Admin**: Repository owner only
- **Write**: All team developers
- **Read**: External reviewers (if needed)

## 3. Repository Secrets Configuration

### Firebase Deployment Secrets
1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:
   - `FIREBASE_SERVICE_ACCOUNT_NIT_GOA_AC_IN`: Firebase service account JSON

### Getting Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nit-goa-ac-in`
3. Navigate to **Project Settings** → **Service accounts**
4. Click **Generate new private key**
5. Copy the entire JSON content to the GitHub secret

## 4. GitHub Actions Workflow Setup

The CI/CD pipeline is already configured in `.github/workflows/ci-cd.yml` and will:
- Run on pushes to `main`, `develop`, `staging`
- Run on pull requests to `main`, `develop`
- Execute linting, testing, and building
- Deploy staging versions from `staging` branch
- Deploy production from `main` branch

## 5. Issue and Pull Request Templates

Templates are configured in:
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`

## 6. Code Owners Configuration

The `.github/CODEOWNERS` file ensures:
- All changes require review from `@mrutyunjaykumarrao`
- Critical files have additional protection
- Component changes can be reviewed by any team member

## 7. Project Board Setup (Optional)

### Creating a Project Board
1. Navigate to **Projects** tab in repository
2. Click **New project**
3. Choose **Board** template
4. Create columns:
   - **Backlog**: New issues and feature requests
   - **To Do**: Prioritized tasks ready for development
   - **In Progress**: Currently being worked on
   - **Review**: Code review and testing phase
   - **Done**: Completed tasks

### Automation Rules
- Automatically move cards to "In Progress" when PR is opened
- Move to "Review" when PR is ready for review
- Move to "Done" when PR is merged

## 8. Security Configuration

### Security Advisories
1. Navigate to **Security** → **Advisories**
2. Enable **Private vulnerability reporting**
3. Configure security contacts

### Dependency Scanning
1. Navigate to **Security** → **Code scanning**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**

## 9. Repository Settings

### General Settings
- **Default branch**: `main`
- **Merge button options**:
  - ✅ Allow merge commits
  - ✅ Allow squash merging
  - ❌ Allow rebase merging (to maintain linear history)
- **Automatically delete head branches**: ✅ Enabled

### Branch Management
- **Default branch**: `main`
- **Protected branches**: `main`, `develop`
- **Active branches**: `main`, `develop`, `staging`

## 10. Team Onboarding Checklist

### For Each New Team Member:
- [ ] Add as collaborator with Write permissions
- [ ] Send invitation email
- [ ] Share repository access
- [ ] Provide documentation links:
  - [ ] `TEAM_COLLABORATION_GUIDE.md`
  - [ ] `DEVELOPMENT_SETUP_GUIDE.md`
  - [ ] `GITHUB_SETUP_GUIDE.md`
- [ ] Assign first issue/task
- [ ] Schedule onboarding session

## 11. Maintenance Tasks

### Weekly:
- Review open pull requests
- Update project board
- Check security alerts
- Monitor CI/CD pipeline status

### Monthly:
- Review branch protection rules
- Update dependencies
- Audit team permissions
- Review and update documentation

## Quick Commands Reference

```bash
# Check repository status
git status
git branch -a

# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Standard workflow
git add .
git commit -m "type: description"
git push origin feature/your-feature-name

# Merge develop into staging for testing
git checkout staging
git merge develop
git push origin staging

# Deploy to production (main branch)
git checkout main
git merge develop
git push origin main
```

## Troubleshooting

### Common Issues:
1. **Branch protection violations**: Ensure all status checks pass
2. **CI/CD failures**: Check GitHub Actions logs
3. **Permission denied**: Verify collaborator permissions
4. **Merge conflicts**: Use Git merge tools or VS Code

### Support:
- Repository owner: `@mrutyunjaykumarrao`
- Documentation: See `TEAM_COLLABORATION_GUIDE.md`
- Issues: Create GitHub issue with appropriate template

## Next Steps

1. Apply all branch protection rules
2. Add team members as collaborators
3. Configure Firebase service account secret
4. Test CI/CD pipeline with a sample PR
5. Create initial project board and issues
6. Begin team onboarding process
