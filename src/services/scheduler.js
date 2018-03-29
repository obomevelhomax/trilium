const script = require('./script');
const Repository = require('./repository');
const cls = require('./cls');

const repo = new Repository();

async function runNotesWithLabel(runAttrValue) {
    const notes = await repo.getEntities(`
        SELECT notes.* 
        FROM notes 
          JOIN labels ON labels.noteId = notes.noteId
                           AND labels.isDeleted = 0
                           AND labels.name = 'run' 
                           AND labels.value = ? 
        WHERE
          notes.type = 'code'
          AND notes.isDeleted = 0`, [runAttrValue]);

    for (const note of notes) {
        script.executeNote(null, note);
    }
}

setTimeout(cls.wrap(() => runNotesWithLabel('backend_startup')), 10 * 1000);

setInterval(cls.wrap(() => runNotesWithLabel('hourly')), 3600 * 1000);

setInterval(cls.wrap(() => runNotesWithLabel('daily'), 24 * 3600 * 1000));