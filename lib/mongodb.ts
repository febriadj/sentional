import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";
import { env } from "@/config/env";

/**
 * Extend globalThis to cache the MongoClient promise across hot-module
 * replacements in development, preventing connection pool exhaustion.
 */
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

interface CachedConnection {
    client: MongoClient;
    clientPromise: Promise<MongoClient>;
}

const MONGO_OPTIONS: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

function createMongoConnection(): CachedConnection {
    const client = new MongoClient(env.MONGODB_URI, MONGO_OPTIONS);
    const clientPromise = client.connect();
    return { client, clientPromise };
}

let clientPromise: Promise<MongoClient>;

if (env.NODE_ENV === "development") {
    /**
     * Development: attach to globalThis so the connection persists across
     * HMR reloads. Without this, each file save would open a new connection.
     */
    if (!globalThis._mongoClientPromise) {
        const { clientPromise: promise } = createMongoConnection();
        globalThis._mongoClientPromise = promise;
    }
    clientPromise = globalThis._mongoClientPromise;
} else {
    /**
     * Production / test: a fresh module instance per serverless invocation.
     * The runtime re-uses warm containers, so this still benefits from the
     * connection pool within a single container lifecycle.
     */
    const { clientPromise: promise } = createMongoConnection();
    clientPromise = promise;
}

export default clientPromise;

/**
 * Convenience helper — resolves the connected client and returns a handle
 * to the specified database. Safe to call from Server Components and
 * API Route handlers.
 *
 * @example
 * const db = await getDatabase("sentional");
 * const users = db.collection("users");
 */
export async function getDatabase(dbName: string) {
    const client = await clientPromise;
    return client.db(dbName);
}
