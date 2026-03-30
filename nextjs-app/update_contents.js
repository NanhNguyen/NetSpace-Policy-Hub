const { createClient } = require('@supabase/supabase-js');
const { policies } = require('./policies_data.js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function run() {
  for (const p of policies) {
    const { error } = await supabase.from('policies')
      .update({ content: p.content })
      .eq('slug', p.slug);
      
    if (error) console.error('Error updating', p.title, error);
    else console.log('Updated DB content for', p.title);
  }
}

run().catch(console.error);
