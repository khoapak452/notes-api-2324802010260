require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../src/models/note');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Note.syncIndexes();

    const scan = await Note.find({ tags: 'docker' })
      .hint({ $natural: 1 })
      .explain('executionStats');

    const indexed = await Note.find({ tags: 'docker' })
      .hint({ tags: 1 })
      .explain('executionStats');

    console.table({
      'Quet toan bo': {
        docsExamined: scan.executionStats.totalDocsExamined,
        returned: scan.executionStats.nReturned,
        ms: scan.executionStats.executionTimeMillis
      },
      'Dung chi muc': {
        docsExamined: indexed.executionStats.totalDocsExamined,
        returned: indexed.executionStats.nReturned,
        ms: indexed.executionStats.executionTimeMillis
      }
    });

    console.log(
      'Ty so giam quet:',
      (scan.executionStats.totalDocsExamined /
        indexed.executionStats.totalDocsExamined).toFixed(2),
      'lan'
    );
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
