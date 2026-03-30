const { Client } = require('pg');

async function fix() {
  const client = new Client({
    connectionString: "postgresql://postgres.xwpkfnzireadfgzcdcbg:Namanhb52%40%40@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
  });
  
  await client.connect();
  
  try {
    await client.query("ALTER TABLE policies ADD COLUMN pdf_url TEXT;");
    console.log("Column pdf_url added!");
  } catch(e) {
    if (e.message.includes('already exists')) {
       console.log("Column already exists.");
       // Let's also reload postgrest schema
       await client.query("NOTIFY pgrst, 'reload schema';");
       console.log("Notified postgrest to reload.");
    } else {
       console.error("Error:", e);
    }
  }
  
  await client.end();
}

fix();
