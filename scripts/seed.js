require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../src/models/note');

const TAGS = [
  'cloud', 'docker', 'nosql', 'security',
  'devops', 'java', 'web'
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Note.deleteMany({ owner: 'seed' });

    const docs = Array.from({ length: 2000 }, (_, i) => ({
      title: `Ghi chu mau ${i + 1}`,
      content: 'Du lieu thu nghiem',
      tags: [TAGS[i % 7], TAGS[(i * 3) % 7]],
      owner: 'seed'
    }));

    await Note.insertMany(docs);
    console.log(`Da chen ${docs.length} ghi chu`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
