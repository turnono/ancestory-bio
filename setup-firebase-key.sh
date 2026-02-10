#!/bin/bash
# Firebase Service Account Key Setup Helper
# This script helps you download and verify the Firebase Admin SDK key

echo "🔑 Firebase Service Account Key Setup"
echo "======================================"
echo ""
echo "To run the scientific data injection script, you need a Firebase Admin SDK key."
echo ""
echo "📋 Steps to download the key:"
echo ""
echo "1. Open this URL in your browser:"
echo "   https://console.firebase.google.com/project/ancestrybio/settings/serviceaccounts/adminsdk"
echo ""
echo "2. Click the 'Generate new private key' button"
echo ""
echo "3. Click 'Generate key' in the confirmation dialog"
echo ""
echo "4. A JSON file will be downloaded (e.g., ancestrybio-firebase-adminsdk-xxxxx.json)"
echo ""
echo "5. Move it to a secure local path outside this repo (example):"
echo "   mkdir -p ~/secrets"
echo "   mv ~/Downloads/ancestrybio-firebase-adminsdk-*.json ~/secrets/ancestrybio-adminsdk.json"
echo ""
echo "6. Verify the file exists:"
echo "   ls -lh ~/secrets/ancestrybio-adminsdk.json"
echo ""
echo "7. Export the credential path and run the data injection script:"
echo "   export FIREBASE_SERVICE_ACCOUNT_PATH=~/secrets/ancestrybio-adminsdk.json"
echo "   node scientific-data-seed.js"
echo ""
echo "⚠️  SECURITY NOTE: Never commit service-account JSON files to git!"
echo ""

# Check if key already exists
if [ -f "$HOME/secrets/ancestrybio-adminsdk.json" ]; then
    echo "✅ ~/secrets/ancestrybio-adminsdk.json already exists!"
    echo ""
    echo "Ready to run:"
    echo "  export FIREBASE_SERVICE_ACCOUNT_PATH=~/secrets/ancestrybio-adminsdk.json"
    echo "  node scientific-data-seed.js"
else
    echo "❌ ~/secrets/ancestrybio-adminsdk.json not found yet."
    echo ""
    echo "Please follow the steps above to download it."
fi
