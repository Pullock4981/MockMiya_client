import { MongoClient } from "mongodb";

const uri: string = `mongodb://${process.env.USER_NAME}:${process.env.PASSWORD}@ac-fqtaxvg-shard-00-00.1twtybw.mongodb.net:27017,ac-fqtaxvg-shard-00-01.1twtybw.mongodb.net:27017,ac-fqtaxvg-shard-00-02.1twtybw.mongodb.net:27017/?ssl=true&replicaSet=atlas-zw5wdw-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

if (!uri) throw new Error("Please add MONGODB_URI to your .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend NodeJS.Global type to include our cached MongoClient
declare global {
  
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so HMR/restarts don't create new connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client (server process is stable there)
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
