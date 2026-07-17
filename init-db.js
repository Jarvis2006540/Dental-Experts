const db = require('./src/lib/db.js').default || require('./src/lib/db.js');
const fs = require('fs');

async function init() {
    try {
        const schema = fs.readFileSync('./schema.sql', 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
        
        for (let stmt of statements) {
            await db.execute(stmt);
        }
        console.log("Database initialized from schema.sql.");
    } catch(err) {
        console.error("Error initializing DB:", err);
    }
}

init();
