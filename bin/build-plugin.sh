#!/bin/sh
# Build plugin distribution archive for WordPress.org using WP-CLI dist-archive
#
# This script creates a production-ready zip file of the plugin
# that can be submitted to the WordPress.org repository

set -e

PLUGIN_SLUG="juanma-mermaid-diagram-block"
PLUGIN_FILE="juanma-mermaid-diagram-block.php"

echo "==> Checking environment for dependencies..."
if [ -f /.dockerenv ]; then
    echo "Running inside Docker container - skipping composer install"
    echo "Dependencies should be installed before running this script"
else
    echo "==> Installing production dependencies..."
    if [ -f "composer.json" ]; then
        composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
    fi
fi

echo "==> Checking for zip utility..."
if ! command -v zip > /dev/null 2>&1; then
    echo "Error: zip utility is not installed."
    if [ -f /.dockerenv ]; then
        echo "Please install it first by running:"
        echo "  docker exec -u root \$(docker ps -qf 'name=tests-cli') apk add --no-cache zip"
    else
        echo "Please install zip utility on your system."
    fi
    exit 1
fi

echo "==> Installing WP-CLI dist-archive command if needed..."
if ! wp package list 2>/dev/null | grep -q "wp-cli/dist-archive-command"; then
    cd /tmp && wp package install wp-cli/dist-archive-command:@stable 2>/dev/null || true
    cd - > /dev/null
fi

# Get back to plugin directory
if [ -f /.dockerenv ]; then
    # Inside Docker container (wp-env)
    cd /var/www/html/wp-content/plugins/${PLUGIN_SLUG}
else
    # Local environment
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    cd "${SCRIPT_DIR}/.."
fi

echo "==> Extracting plugin version..."
# Extract version from main plugin file
VERSION=$(grep -E "^\s*\*\s*Version:" ${PLUGIN_FILE} | sed -E 's/.*Version:\s*([0-9.]+).*/\1/')
if [ -z "$VERSION" ]; then
    # Fallback to npm package version or default
    VERSION="${1:-1.0.0}"
    echo "Warning: Could not extract version from ${PLUGIN_FILE}, using ${VERSION}"
fi

echo "==> Creating distribution archive for version ${VERSION}..."
# Convert dots to hyphens for filename (WordPress.org convention)
VERSION_HYPHENATED=$(echo "$VERSION" | tr '.' '-')
OUTPUT_FILE="dist/${PLUGIN_SLUG}-${VERSION_HYPHENATED}.zip"

# Create build directory and remove old archive
mkdir -p dist
rm -f "${OUTPUT_FILE}"

# Create the distribution archive using WP-CLI
wp dist-archive . "${OUTPUT_FILE}" --skip-plugins

echo ""
echo "=========================================="
echo "==> Build complete!"
echo "==> Archive: ${OUTPUT_FILE}"
echo "==> Version: ${VERSION}"
echo "=========================================="

# Show file size
if [ -f "${OUTPUT_FILE}" ]; then
    ls -lh "${OUTPUT_FILE}" | awk '{print "==> File size: " $5}'
fi

echo ""
echo "This file is ready to be uploaded to WordPress.org"