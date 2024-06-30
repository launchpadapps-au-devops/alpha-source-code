#!/bin/bash

# Check if the script is called with correct arguments
if [ $# -ne 2 ]; then
    echo "Usage: $0 <yaml_file> <new_image_name>"
    exit 1
fi

yaml_file=$1
new_image_name=$2

# Install yq if it is not already installed
if ! command -v yq &> /dev/null; then
    echo "yq not found. Installing yq..."
    sudo wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/bin/yq
    sudo chmod +x /usr/bin/yq
    echo "yq installed successfully."
fi

# Update the image name in the containers section of Deployment only
if yq eval '(.spec.template.spec.containers[].image = "'"$new_image_name"'") as $img | select(.kind == "Deployment") | $img' "$yaml_file" -i; then
    echo "Image name in the Deployment section of $yaml_file has been replaced with $new_image_name"
else
    echo "Replacement not successful"
fi

