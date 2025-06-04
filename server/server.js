import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

function readData(name) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]', 'utf-8');
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
}

function writeData(name, data) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());

function crudRoutes(entity) {
  const file = `${entity}.json`;

  app.get(`/api/${entity}`, (req, res) => {
    const list = readData(file);
    const { date, hall } = req.query;
    if (entity === 'schedules' && (date || hall)) {
      const filtered = list.filter(
        (s) => (!date || s.date === date) && (!hall || s.hall === hall)
      );
      return res.json(filtered);
    }
    res.json(list);
  });

  app.post(`/api/${entity}`, (req, res) => {
    const list = readData(file);
    const item = { id: nanoid(), ...req.body };
    list.push(item);
    writeData(file, list);
    res.json(item);
  });

  app.put(`/api/${entity}/:id`, (req, res) => {
    const list = readData(file);
    const idx = list.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    list[idx] = { ...list[idx], ...req.body };
    writeData(file, list);
    res.json(list[idx]);
  });

  app.delete(`/api/${entity}/:id`, (req, res) => {
    const list = readData(file);
    const idx = list.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    const removed = list.splice(idx, 1)[0];
    writeData(file, list);
    res.json(removed);
  });
}

['accounts', 'groups', 'halls', 'teams', 'schedules'].forEach(crudRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
