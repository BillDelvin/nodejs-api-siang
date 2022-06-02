const connDB = require("./config");

const todosTbl = "todos";
const todosDetailTbl = "todos_detail";

module.exports = {
  todosTable: () => {
    connDB.getConnection(async (err, conn) => {
      if (err) throw err; // in here

      try {
        const [checkTodosTable] = await conn.promise().query(`
            SHOW TABLES LIKE '${todosTbl}'
        `);

        if (checkTodosTable.length === 0) {
          await conn.promise().query(`
            CREATE TABLE ${todosTbl} (
            id VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY, 
            todoTitle CHAR(255) NOT NULL, 
            isDone TINYINT NOT NULL
            );
          `);
        }

        const [checkTodosDetailTable] = await conn.promise().query(`
            SHOW TABLES LIKE '${todosDetailTbl}'
        `);

        if (checkTodosDetailTable.length === 0) {
          await conn.promise().query(`
            CREATE TABLE ${todosDetailTbl} (
            id VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY, 
            todoDescription CHAR(255) NOT NULL, 
            todoId VARCHAR(36) NOT NULL,
            CONSTRAINT todoDescription_ibfk_1 FOREIGN KEY (todoId) REFERENCES ${todosTbl}(id)
            );
          `);
        }

        conn.release();
      } catch (error) {
        console.log(error); // get from err from top
      }
    });
  },
};
