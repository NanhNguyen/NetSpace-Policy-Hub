const { Client } = require('pg');

const connectionString = 'postgresql://postgres.xwpkfnzireadfgzcdcbg:Namanhb52%40%40@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
    connectionTimeoutMillis: 5000,
    // No SSL
});

async function test() {
    console.log('Connecting without SSL...');
    try {
        await client.connect();
        console.log('Connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
}

test();
