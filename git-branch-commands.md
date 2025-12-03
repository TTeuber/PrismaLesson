# Git Branch Commands Reference

## Creating Branches

### Create a new branch
```bash
git branch <branch-name>
```
Creates a new branch but doesn't switch to it.

### Create and switch to a new branch
```bash
git checkout -b <branch-name>
# or
git switch -c <branch-name>
```
Creates a new branch and immediately switches to it.

### Create a branch from a specific branch
```bash
git checkout -b <new-branch> <source-branch>
# or
git switch -c <new-branch> <source-branch>
```
Creates a new branch based on a specific source branch (can be local or remote).

## Switching Branches

### Switch to an existing branch
```bash
git checkout <branch-name>
# or
git switch <branch-name>
```
Switches to the specified branch.

### Checkout a remote branch
```bash
git checkout <branch-name>
```
If the branch exists on remote but not locally, Git automatically creates a local tracking branch.

## Listing Branches

### List local branches
```bash
git branch
```
Shows all local branches. Current branch is marked with an asterisk (*).

### List remote branches
```bash
git branch -r
```
Shows branches that exist on the remote repository.

### List all branches (local and remote)
```bash
git branch -a
```
Shows both local and remote branches.

### List branches with additional information
```bash
git branch -v
```
Shows branches with their last commit message.

```bash
git branch -vv
```
Shows branches with last commit and tracking information.

## Deleting Branches

### Safe delete (prevents deletion if not merged)
```bash
git branch -d <branch-name>
```
Deletes the branch only if it has been fully merged.

### Force delete
```bash
git branch -D <branch-name>
```
Deletes the branch regardless of merge status.

## Renaming Branches

### Rename current branch
```bash
git branch -m <new-name>
```
Renames the branch you're currently on.

### Rename a different branch
```bash
git branch -m <old-name> <new-name>
```
Renames a branch without switching to it.

## Pushing Branches

### Push a new local branch to remote
```bash
git push -u origin <branch-name>
```
Pushes the branch to remote and sets up tracking. The `-u` flag allows future pushes with just `git push`.

### Push current branch to remote
```bash
git push -u origin HEAD
```
Pushes your current branch to remote using the same branch name.

### Push without setting up tracking
```bash
git push origin <branch-name>
```
Pushes the branch but doesn't set up tracking for future pushes.

## Merging and Rebasing

### Merge a branch into current branch
```bash
git merge <branch-name>
```
Merges the specified branch into your current branch.

### Rebase current branch onto another
```bash
git rebase <branch-name>
```
Rewrites your branch history to appear as if it was built on top of the specified branch.

## Fetching Remote Information

### Fetch all remote branches
```bash
git fetch
# or
git fetch origin
```
Updates your local information about remote branches without modifying your working files.

## Checking Status

### View current branch and status
```bash
git status
```
Shows your current branch, tracking information, and any uncommitted changes.
