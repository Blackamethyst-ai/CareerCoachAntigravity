#!/bin/bash

# Define the target directory on the Desktop
TARGET_DIR="$HOME/Desktop/AntigravityGlobal"

# Create the directory structure
mkdir -p "$TARGET_DIR/workflows"

# Copy the workflow files from the current project to the global folder
if [ -d ".agent/workflows" ]; then
    cp .agent/workflows/*.md "$TARGET_DIR/workflows/"
    echo "✅ Agent workflows successfully exported to: $TARGET_DIR"
else
    echo "❌ Error: .agent/workflows directory not found in current location."
    exit 1
fi

# Create a helper script inside the global folder for easy installation
INSTALLER_SCRIPT="$TARGET_DIR/install.sh"
cat << 'EOF' > "$INSTALLER_SCRIPT"
#!/bin/bash
# Run this script in any project to install the Antigravity Agent Workflows

mkdir -p .agent/workflows
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/workflows"

cp "$SOURCE_DIR"/*.md .agent/workflows/
echo "✅ Antigravity workflows installed into .agent/workflows/"
EOF

chmod +x "$INSTALLER_SCRIPT"

echo ""
echo "================================================================"
echo "SETUP COMPLETE"
echo "================================================================"
echo "You can now install these agents in ANY project by running:"
echo "$INSTALLER_SCRIPT"
echo ""
echo "Or, for permanent access, add this alias to your ~/.zshrc:"
echo "alias get-agents='$INSTALLER_SCRIPT'"
