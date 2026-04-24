const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('Missing Key: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY). Supabase client not initialized.');
	module.exports = null;
} else {
	try {
		const supabase = createClient(supabaseUrl, supabaseServiceKey);
		module.exports = supabase;
	} catch (err) {
		console.error('Failed to initialize Supabase client:', err.message || err);
		module.exports = null;
	}
}
