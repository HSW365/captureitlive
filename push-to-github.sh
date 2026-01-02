#!/usr/bin/env bash
set -e

# --- CONFIG (from Replit Secrets) ---
# REPO_URL: https://github.com/USERNAME/captureitlive.git  (or ssh URL)
# GIT_NAME: Your Name
# GIT_EMAIL: you@example.com

if [ -z "$REPO_URL" ]; then
  echo "❌ REPO_URL secret not set"; exit 1
fi
if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
  echo "❌ GIT_NAME / GIT_EMAIL secrets not set"; exit 1
fi

# Git identity
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

# Init repo (first time)
[ -d ".git" ] || git init

# Link remote (idempotent)
if git remote | grep -q origin; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

# Commit + push
git add -A
msg="${1:-"🧘‍♀️ CaptureIt wellness platform update $(date +'%Y-%m-%d %H:%M:%S')"}"
git commit -m "$msg" || echo "Nothing to commit."
git branch -M main
git push -u origin main

echo "✅ CaptureIt wellness platform pushed to GitHub successfully! 🌟"