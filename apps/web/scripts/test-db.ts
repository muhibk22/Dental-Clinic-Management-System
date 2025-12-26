
import { db } from '../src/lib/db';

async function main() {
    try {
        console.log('Connecting to database...');
        // Try to query something simple, or just check connection
        const userCount = await db.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);
    } catch (e) {
        console.error('Failed to connect to database:', e);
        process.exit(1);
    } finally {
        // Assuming db is the prismaclient instance
        // We might need to disconnect if it handles it that way, but for a script it's fine.
    }
}

main();
