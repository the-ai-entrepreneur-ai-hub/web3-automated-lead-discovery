import os
import shutil
import logging
from datetime import datetime, timedelta

# --- Configuration ---
SOURCE_DRIVE = "C:\\"
DESTINATION_DRIVE = "E:\\Backup"
LOG_FILE = "file_move.log"

# Configure logging
logging.basicConfig(filename=LOG_FILE, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def move_old_project_backups(source_dir, dest_dir, days_old=180):
    """Moves project backups older than a specified number of days."""
    logging.info(f"Checking for project backups in: {source_dir}")
    
    # Define what a project backup looks like (e.g., .zip, .bak files)
    backup_extensions = ['.zip', '.bak', '.tar.gz']
    
    for root, _, files in os.walk(source_dir):
        for file in files:
            if any(file.endswith(ext) for ext in backup_extensions):
                file_path = os.path.join(root, file)
                try:
                    # Check file modification time
                    file_mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                    if datetime.now() - file_mod_time > timedelta(days=days_old):
                        # Create a corresponding directory in the destination
                        relative_path = os.path.relpath(root, source_dir)
                        dest_path = os.path.join(dest_dir, "project_backups", relative_path)
                        os.makedirs(dest_path, exist_ok=True)
                        
                        # Move the file
                        shutil.move(file_path, os.path.join(dest_path, file))
                        logging.info(f"Moved old backup: {file_path} to {dest_path}")
                except Exception as e:
                    logging.error(f"Failed to move {file_path}: {e}")
def move_video_files(source_dir, dest_dir):
    """Moves video files."""
    logging.info(f"Checking for video files in: {source_dir}")
    
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv']
    
    for root, _, files in os.walk(source_dir):
        for file in files:
            if any(file.lower().endswith(ext) for ext in video_extensions):
                file_path = os.path.join(root, file)
                try:
                    # Create a corresponding directory in the destination
                    relative_path = os.path.relpath(root, source_dir)
                    dest_path = os.path.join(dest_dir, "videos", relative_path)
                    os.makedirs(dest_path, exist_ok=True)
                    
                    # Move the file
                    shutil.move(file_path, os.path.join(dest_path, file))
                    logging.info(f"Moved video: {file_path} to {dest_path}")
                except FileNotFoundError:
                    logging.warning(f"File not found, skipping (already moved?): {file_path}")
                except PermissionError:
                    logging.warning(f"File is in use, skipping: {file_path}")
                except Exception as e:
                    logging.error(f"Failed to move {file_path}: {e}")

def move_specific_files(files_to_move, dest_dir):
    """Moves a list of specific files."""
    logging.info("Moving specific files.")
    for file_path in files_to_move:
        if os.path.exists(file_path):
            try:
                # Create a corresponding directory in the destination
                dest_path = os.path.join(dest_dir, "specific_files")
                os.makedirs(dest_path, exist_ok=True)
                
                # Move the file
                shutil.move(file_path, os.path.join(dest_path, os.path.basename(file_path)))
                logging.info(f"Moved specific file: {file_path} to {dest_path}")
            except PermissionError:
                logging.warning(f"File is in use, skipping: {file_path}")
            except Exception as e:
                logging.error(f"Failed to move {file_path}: {e}")
        else:
            logging.warning(f"File not found, skipping: {file_path}")


if __name__ == "__main__":
    print("Starting file organization script...")
    logging.info("--- Starting File Move Script ---")
    
    # --- Define specific directories to scan for videos ---
    video_scan_directories = [
        os.path.join(SOURCE_DRIVE, "Users", "Administrator", "Searches", "Videos"),
        os.path.join(SOURCE_DRIVE, "Users", "Administrator", "Videos"),
    ]

    for directory in video_scan_directories:
        if os.path.exists(directory):
            move_video_files(directory, DESTINATION_DRIVE)
        else:
            logging.warning(f"Directory not found, skipping: {directory}")

    # --- Define specific files to move ---
    specific_files = [
        os.path.join(SOURCE_DRIVE, "Users", "Administrator", "Downloads", "OllamaSetup.exe"),
    ]
    move_specific_files(specific_files, DESTINATION_DRIVE)
            
    logging.info("--- Script Finished ---")
    print("File organization script finished. Check file_move.log for details.")
    print("File organization script finished. Check file_move.log for details.")