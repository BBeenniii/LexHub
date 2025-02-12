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

if not os.path.exists('db_temp'):
    os.makedirs('db_temp')

for collection_name in collections:

    collection = db[collection_name]
    data = list(collection.find())

    filename = f"db_temp/{collection_name}.json"
    with open(filename, "w") as f:
        json.dump(data, f, default=str)

    with open(filename, "r") as f:
        content = f.read()
        commit_message = f"Export and update collection '{collection_name}' on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        try:
            existing_file = repo.get_contents(f"Database/{collection_name}.json")
            repo.delete_file(existing_file.path, f"Delete old {collection_name}.json before uploading", existing_file.sha)
            print(f"Deleted old {collection_name}.json from GitHub.")
        except:
            print(f"{collection_name}.json does not exist on GitHub. Creating a new file.")

        repo.create_file(f"Database/{collection_name}.json", commit_message, content)
        print(f"Uploaded new {collection_name}.json to GitHub.")
    
    os.remove(filename)
os.rmdir('db_temp')

for file in repo.get_contents("Database"):
    if file.name.endswith(".json.json"):
        repo.delete_file(file.path, f"All collections exported and uploaded!", file.sha)
        print(f"Deleted duplication ({file.name}) from GitHub.")

print("All collections exported and uploaded to GitHub.")
