const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.xwpkfnzireadfgzcdcbg:Namanhb52%40%40@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';
const sqlPath = path.join(__dirname, '..', 'nextjs-app', 'setup.sql');

async function setup() {
    const client = new Client({ connectionString });
    try {
        console.log('Reading setup.sql...');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Connecting to database...');
        await client.connect();

        console.log('Executing setup script...');
        await client.query(sql);

        console.log('✅ Database setup successfully!');

        // Seed some initial data for testing
        console.log('Seeding initial data...');
        await client.query(`
      INSERT INTO policies (title, slug, content, category, published) 
      VALUES 
      ('Quy định làm việc từ xa', 'remote-work-policy', 'Nội dung quy định làm việc từ xa...', 'HR', true),
      ('Chính sách nghỉ phép', 'leave-policy', 'Nội dung chính sách nghỉ phép...', 'Benefits', true)
      ON CONFLICT (slug) DO NOTHING;
    `);
        console.log('✅ Seeding complete!');

    } catch (err) {
        console.error('❌ Error setting up database:', err.message);
    } finally {
        await client.end();
    }
}

setup();
