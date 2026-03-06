#!/bin/bash
cd "F:/Discord Bots/Main Development/Discord Bot Dashboard"

echo "=== Step 1: git add ==="
git add src/components/ui/segmented-control.jsx
echo "add exit code: $?"

echo "=== Step 2: git commit ==="
git commit -m "fix: SegmentedControl crash from mismatched prop names

The component only accepted data and onChange props, but Settings.jsx and
NotificationFeed.jsx passed items and onValueChange. This caused data to
be undefined, crashing on data.map().

Component now accepts both prop names with fallbacks:
data || items || [] and onChange || onValueChange

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
echo "commit exit code: $?"

echo "=== Step 3: git status ==="
git status

echo "=== Step 4: latest commit hash ==="
git log --oneline -1
