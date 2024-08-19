
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://strawhats:iEXibstNH2FplQf8@strawhatsdatabase.8ymeywa.mongodb.net/?retryWrites=true&w=majority&appName=StrawHatsDatabase"
client = MongoClient(uri, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)