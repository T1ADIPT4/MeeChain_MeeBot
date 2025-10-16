#!/bin/bash

# Automated Deploy Workflow - Validation Script
# Checks that all required files and configurations are in place

echo "🔍 Validating Automated Deploy Workflow Setup..."
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} Found: $1"
    else
        echo -e "${RED}❌${NC} Missing: $1"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} Found: $1/"
    else
        echo -e "${RED}❌${NC} Missing: $1/"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to warn if file missing
warn_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} Found: $1"
    else
        echo -e "${YELLOW}⚠️${NC}  Optional: $1"
        WARNINGS=$((WARNINGS + 1))
    fi
}

echo "📋 Checking Workflow Files..."
check_file ".github/workflows/automate-deploy.yml"
echo ""

echo "📋 Checking Documentation Files..."
check_file "WORKFLOW_GUIDE.md"
check_file "SECRETS_SETUP.md"
check_file "IMPLEMENTATION_WORKFLOW.md"
check_file "QUICK_REFERENCE.md"
echo ""

echo "📋 Checking Viewer Files..."
check_dir "docs"
check_file "docs/index.html"
check_file "docs/README.md"
check_dir "docs/status"
check_file "docs/status/patch-status.json"
check_dir "docs/assets"
check_file "docs/assets/README.md"
echo ""

echo "📋 Checking MSIX Template..."
check_dir "msix-template"
check_file "msix-template/AppxManifest.xml"
check_file "msix-template/README.md"
echo ""

echo "📋 Checking Example Files..."
check_file "examples/sample-patch.patch"
check_file "examples/README-patches.md"
echo ""

echo "📋 Checking Optional Assets..."
warn_file "docs/assets/logo.png"
warn_file "docs/assets/splash.png"
echo ""

echo "📋 Checking Configuration..."
check_file ".gitignore"
check_file "package.json"
echo ""

# Validate YAML syntax
echo "📋 Validating Workflow YAML..."
if command -v python3 &> /dev/null; then
    if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/automate-deploy.yml'))" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} YAML syntax valid"
    else
        echo -e "${RED}❌${NC} YAML syntax error"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Cannot validate YAML (python3 not found)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check HTML
echo "📋 Validating HTML..."
if [ -f "docs/index.html" ]; then
    if grep -q "<!DOCTYPE html>" "docs/index.html" && grep -q "</html>" "docs/index.html"; then
        echo -e "${GREEN}✅${NC} HTML structure looks valid"
    else
        echo -e "${YELLOW}⚠️${NC}  HTML may be malformed"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

# Check JSON
echo "📋 Validating JSON..."
if [ -f "docs/status/patch-status.json" ]; then
    if command -v python3 &> /dev/null; then
        if python3 -c "import json; json.load(open('docs/status/patch-status.json'))" 2>/dev/null; then
            echo -e "${GREEN}✅${NC} JSON syntax valid"
        else
            echo -e "${RED}❌${NC} JSON syntax error"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${YELLOW}⚠️${NC}  Cannot validate JSON (python3 not found)"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

# Check for GitHub Pages setup
echo "📋 Checking GitHub Configuration..."
echo -e "${YELLOW}⚠️${NC}  Manual check required:"
echo "   1. Go to Settings → Pages"
echo "   2. Ensure source is set to 'gh-pages' branch"
echo "   3. Directory should be '/ (root)'"
echo ""

# Check for secrets
echo "📋 Checking GitHub Secrets..."
echo -e "${YELLOW}⚠️${NC}  Manual check required:"
echo "   1. Go to Settings → Secrets → Actions"
echo "   2. Ensure SIGNING_CERT_PFX exists"
echo "   3. Ensure SIGNING_CERT_PASSWORD exists"
echo "   (GITHUB_TOKEN is auto-provided)"
echo ""

# Summary
echo "═══════════════════════════════════════════════════"
echo "📊 Validation Summary"
echo "═══════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure GitHub Secrets (see SECRETS_SETUP.md)"
    echo "  2. Enable GitHub Pages (Settings → Pages)"
    echo "  3. Run workflow (Actions → Automated Deploy and Release)"
    echo "  4. Test with: patch_file=examples/sample-patch.patch version=1.0.0"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Warnings are for optional files or manual setup steps."
    echo "The workflow should work, but review warnings above."
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before running the workflow."
    exit 1
fi
