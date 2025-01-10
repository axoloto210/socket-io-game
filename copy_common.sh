#!/bin/bash

SCRIPT_DIR=$(
    cd $(dirname $0)
    pwd
)

SOURCE_DIR="${SCRIPT_DIR}/common"
SERVER_DEST_DIR="${SCRIPT_DIR}/server/src/common"
CLIENT_DEST_DIR="${SCRIPT_DIR}/client/src/common"

copy_directory() {
    local dest_dir=$1
    local parent_dir=$(dirname "$dest_dir")

    if [ ! -d "$parent_dir" ]; then
        echo "Error: Destination directory $parent_dir does not exist."
        echo "Please make sure $parent_dir directory exists."
        return 1
    fi

    if [ -d "$dest_dir" ]; then
        echo "Removing existing common directory in $parent_dir..."
        rm -rf "$dest_dir"
    fi

    echo "Copying common directory to $parent_dir..."
    cp -r "$SOURCE_DIR" "$dest_dir"

    if [ $? -eq 0 ]; then
        echo "Successfully copied common directory to $parent_dir/"
        return 0
    else
        echo "Error: Failed to copy directory to $parent_dir"
        return 1
    fi
}

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory $SOURCE_DIR does not exist."
    exit 1
fi

copy_directory "$SERVER_DEST_DIR"
server_status=$?

copy_directory "$CLIENT_DEST_DIR"
client_status=$?

if [ $server_status -eq 0 ] && [ $client_status -eq 0 ]; then
    echo "All copy operations completed successfully!"
    exit 0
else
    echo "Some copy operations failed. Please check the error messages above."
    exit 1
fi
