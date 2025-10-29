#!/bin/sh
# Simple build script for creating plugin distribution archive
# This script doesn't require wp-env or WP-CLI

set -e

PLUGIN_SLUG="juanma-mermaid-diagram-block"
PLUGIN_FILE="juanma-mermaid-diagram-block.php"

# Get to the plugin root directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${SCRIPT_DIR}/.."

echo "==> Building production assets..."
if [ -f "package.json" ]; then
    echo "Installing npm dependencies..."
    npm install
    echo "Building assets..."
    npm run build
fi

echo "==> Installing production dependencies..."
if [ -f "composer.json" ]; then
    composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
fi

echo "==> Extracting plugin version..."
# Extract version from main plugin file
VERSION=$(grep -E "^\s*\*\s*Version:" ${PLUGIN_FILE} | sed -E 's/.*Version:\s*([0-9.]+).*/\1/')
if [ -z "$VERSION" ]; then
    # Fallback to package.json version
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")
    echo "Warning: Could not extract version from ${PLUGIN_FILE}, using ${VERSION}"
fi

echo "==> Creating distribution archive for version ${VERSION}..."
# Convert dots to hyphens for filename (WordPress.org convention)
VERSION_HYPHENATED=$(echo "$VERSION" | tr '.' '-')
OUTPUT_FILE="${PLUGIN_SLUG}-${VERSION_HYPHENATED}.zip"

# Create build directory
mkdir -p build

# Create temporary directory for the build
TMP_DIR=$(mktemp -d)
BUILD_DIR="${TMP_DIR}/${PLUGIN_SLUG}"

echo "==> Copying files to build directory..."
mkdir -p "${BUILD_DIR}"

# Copy all files except those in .distignore
if [ -f ".distignore" ]; then
    # Use rsync with .distignore
    rsync -a --exclude-from=.distignore . "${BUILD_DIR}/"
else
    # Manual exclusion if no .distignore
    rsync -a \
        --exclude='.git' \
        --exclude='.github' \
        --exclude='node_modules' \
        --exclude='src' \
        --exclude='bin' \
        --exclude='tests' \
        --exclude='*.md' \
        --exclude='.distignore' \
        --exclude='.gitignore' \
        --exclude='.wp-env.json' \
        --exclude='composer.json' \
        --exclude='composer.lock' \
        --exclude='package.json' \
        --exclude='package-lock.json' \
        --exclude='phpcs.xml' \
        --exclude='phpstan.neon' \
        --exclude='.vscode' \
        --exclude='.idea' \
        --exclude='*.log' \
        . "${BUILD_DIR}/"
fi

echo "==> Creating zip archive..."
cd "${TMP_DIR}"
zip -r "${OUTPUT_FILE}" "${PLUGIN_SLUG}" -q

# Move the zip file to the build directory
cd - > /dev/null
mv "${TMP_DIR}/${OUTPUT_FILE}" "build/${OUTPUT_FILE}"

# Clean up
rm -rf "${TMP_DIR}"

echo ""
echo "=========================================="
echo "==> Build complete!"
echo "==> Archive: build/${OUTPUT_FILE}"
echo "==> Version: ${VERSION}"
echo "=========================================="

# Show file size
if [ -f "build/${OUTPUT_FILE}" ]; then
    ls -lh "build/${OUTPUT_FILE}" | awk '{print "==> File size: " $5}'
fi

echo ""
echo "This file is ready to be uploaded to WordPress.org"