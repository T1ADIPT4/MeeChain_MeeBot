# Example Patch Files

This directory contains example patch files for testing the automated deployment workflow.

## Available Patches

### sample-patch.patch

A minimal example patch that updates the README.md description.

**Changes**:
- Updates project description
- Adds link to releases

**Usage**:
```bash
# Test locally
git apply examples/sample-patch.patch

# Via workflow
# Use "examples/sample-patch.patch" as the patch_file input
```

## Creating Your Own Patches

### 1. Make Changes

Edit files as needed:
```bash
# Make your changes
vim src/someFile.ts
```

### 2. Create Patch

Generate patch from uncommitted changes:
```bash
# From staged changes
git add .
git diff --cached > my-changes.patch

# From working directory
git diff > my-changes.patch

# From specific commits
git diff commit1 commit2 > my-changes.patch
```

### 3. Test Patch

Always test before committing:
```bash
# Check if patch applies cleanly
git apply --check my-changes.patch

# Apply the patch
git apply my-changes.patch

# Revert if needed
git apply -R my-changes.patch
```

### 4. Commit Patch File

```bash
git add my-changes.patch
git commit -m "Add patch for feature X"
git push
```

## Patch Best Practices

1. **Keep patches small and focused**
   - One feature or fix per patch
   - Easier to review and debug

2. **Test before creating**
   - Ensure changes build successfully
   - Run tests locally

3. **Include context**
   - Name patches descriptively
   - Add comments in the patch if needed

4. **Version compatibility**
   - Ensure patch is compatible with target branch
   - Check for conflicting changes

## Workflow Integration

The automated workflow will:

1. ✅ Check if patch file exists
2. ✅ Validate patch with `git apply --check`
3. ✅ Apply patch if valid
4. ✅ Build and test
5. ✅ Generate status report
6. ✅ Create release if successful

## Troubleshooting

### Patch Fails to Apply

**Issue**: Patch has conflicts

**Solution**:
```bash
# Update your branch first
git pull origin main

# Regenerate patch
git diff > new-patch.patch
```

### Wrong Base Commit

**Issue**: Patch created from different commit

**Solution**:
- Ensure you're on the correct branch
- Check git log to find right commit
- Regenerate patch from correct base

## Examples

### Feature Patch
```bash
# Add new feature
# Create patch with descriptive name
git diff > feature-add-analytics.patch
```

### Bug Fix Patch
```bash
# Fix specific bug
# Include issue number in name
git diff > bugfix-123-memory-leak.patch
```

### Multi-file Patch
```bash
# Changes across multiple files
git add src/ tests/
git diff --cached > feature-complete-system.patch
```

## Related Documentation

- [WORKFLOW_GUIDE.md](../WORKFLOW_GUIDE.md) - Complete workflow guide
- [Git Patch Documentation](https://git-scm.com/docs/git-apply)
- [GitHub Actions](../.github/workflows/automate-deploy.yml)
