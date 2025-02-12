import os
import json
import pymongo
from github import Github
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

mongo_client = pymongo.MongoClient("mongodb://localhost:27017")
db = mongo_client["LexHub"]

github_token = os.getenv("GITHUB_TOKEN")

if not github_token:
    print("A GITHUB_TOKEN környezeti változó nincs beállítva!")
    exit(1)
    
repo_name = "BBeenniii/LexHub"
g = Github(github_token)
repo = g.get_repo(repo_name)

collections = db.list_collection_names()

db_temp_dir = "db_temp"
os.makedirs(db_temp_dir, exist_ok=True)

for collection_name in collections:
    file_path = f"Database/{collection_name}.json"

    try:
        file_content = repo.get_contents(file_path)
        content = file_content.decoded_content.decode("utf-8")
        
        with open(f"{db_temp_dir}/{collection_name}.json", "w") as f:
            f.write(content)
        
        with open(f"{db_temp_dir}/{collection_name}.json", "r") as f:
            data = json.load(f)

        collection = db[collection_name]
        
        for document in data:
            if '_id' in document:
                del document['_id'] 
            result = collection.update_one(
                {'user_id': document['user_id']},
                {'$set': document},  
                upsert=True  
            )
            if result.matched_count > 0:
                print(f"Updated document with user_id: {document['user_id']}")
            else:
                print(f"Inserted new document with user_id: {document['user_id']}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for filename in os.listdir(db_temp_dir):
    file_path = os.path.join(db_temp_dir, filename)
    if os.path.isfile(file_path):
        os.remove(file_path)
        
os.rmdir(db_temp_dir)

print("All collections have been updated successfully!")
