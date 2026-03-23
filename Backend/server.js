require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/izracuni – spremanje novog izračuna
app.post('/api/izracuni', async (req, res) => {
  try {
    const {
      broj_diskova,
      kapacitet_po_disk_gb,
      jedinica,
      raid_razina,
      gubitak_formatiranja,
      sirovi_kapacitet_gb,
      iskoristivo_gb,
      ucinkovitost,
      tolerancija,
      biljeska
    } = req.body;

    const { data, error } = await supabase
      .from('izracuni')
      .insert([
        {
          broj_diskova,
          kapacitet_po_disk_gb,
          jedinica,
          raid_razina,
          gubitak_formatiranja,
          sirovi_kapacitet_gb,
          iskoristivo_gb,
          ucinkovitost,
          tolerancija,
          biljeska
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/izracuni – dohvat svih izračuna
app.get('/api/izracuni', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('izracuni')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));