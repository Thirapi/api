const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const cors = require('micro-cors')();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

module.exports = cors(handler);
