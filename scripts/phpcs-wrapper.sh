#!/bin/bash
# Wrapper script for PHPCS that suppresses PHP deprecation warnings
# This is needed for PHP 8.4 compatibility with PHPCSUtils

# Suppress deprecation warnings by setting error_reporting
php -d error_reporting='E_ALL & ~E_DEPRECATED' vendor/bin/phpcs "$@" 2>/dev/null