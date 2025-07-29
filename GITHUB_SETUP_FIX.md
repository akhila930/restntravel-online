# 🔧 GitHub Permission Fix - RestNTravel

## 🚨 **Problem Identified:**
You're getting a **403 Permission Denied** error because you're trying to push to a repository you don't own.

## ✅ **Solution: Create Your Own Repository**

### **Step 1: Create New GitHub Repository**

1. **Go to [github.com](https://github.com)**
2. **Sign in with your account** (`akhila930`)
3. **Click the "+" icon** → **"New repository"**
4. **Repository name:** `restntravel-online`
5. **Description:** `RestNTravel E-commerce Website`
6. **Make it Public** (for free Vercel deployment)
7. **Don't initialize** with README (we already have files)
8. **Click "Create repository"**

### **Step 2: Update Git Remote**

Run these commands in your terminal:

```bash
# Remove the old remote
git remote remove origin

# Add your new repository
git remote add origin https://github.com/akhila930/restntravel-online.git

# Verify the new remote
git remote -v
```

### **Step 3: Push to Your Repository**

```bash
# Push to your new repository
git push -u origin main
```

## 🔐 **Alternative: Use GitHub CLI (Easier)**

If you have GitHub CLI installed:

```bash
# Install GitHub CLI if not installed
sudo apt install gh

# Login to GitHub
gh auth login

# Create repository and push in one command
gh repo create restntravel-online --public --source=. --remote=origin --push
```

## 🚀 **After Fixing GitHub:**

Once you've successfully pushed to your repository:

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your repository:** `akhila930/restntravel-online`
4. **Configure and deploy**

## 📋 **Quick Commands to Run:**

```bash
# 1. Remove old remote
git remote remove origin

# 2. Add your new repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/restntravel-online.git

# 3. Verify remote
git remote -v

# 4. Push to your repository
git push -u origin main
```

## 🎯 **Expected Result:**

After running these commands, you should see:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads.
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), done.
Total XX (delta XX), reused XX (delta XX), pack-reused XX
To https://github.com/YOUR_USERNAME/restntravel-online.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔧 **If You Still Get Permission Errors:**

### **Check GitHub Authentication:**
```bash
# Check if you're authenticated
git config --global user.name
git config --global user.email

# Set your GitHub credentials if needed
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### **Use Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token
3. Use token as password when pushing

---

## ✅ **Success Indicators:**

- ✅ Repository created under your account
- ✅ Code pushed successfully
- ✅ No permission errors
- ✅ Ready for Vercel deployment

**Once this is fixed, you can proceed with the Vercel deployment!** 🚀 