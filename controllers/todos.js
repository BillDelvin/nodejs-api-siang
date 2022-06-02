const connDB = require("../database/config");
const { randomBytes } = require("crypto");

// req is a data that come from user
// res is a data that return from server
module.exports = {
  created: (req, res) => {
    connDB.getConnection(async (err, conn) => {
      const { todoTitle, todoDescription } = req.body;
      if (err) throw err;

      try {
        const id = randomBytes(8).toString("hex");
        const insertData = await conn.promise().query(`
          INSERT INTO todos (id, todoTitle, isDone) 
          VALUES ('${id}', '${todoTitle}', 0)
        `);

        if (insertData) {
          const detailId = randomBytes(8).toString("hex");
          const insertDetail = await conn.promise().query(`
            INSERT INTO todos_detail (id, todoDescription, todoId) 
            VALUES ('${detailId}', '${todoDescription}', '${id}')
          `);

          if (insertDetail) {
            return res.status(200).json("Added successfully!");
          }
        }
      } catch (error) {
        return res.status(400).json("Something went wrong!");
      }
    });
  },
  getAll: (req, res) => {
    connDB.getConnection(async (err, conn) => {
      if (err) throw err;

      try {
        const [getAll] = await conn.promise().query(`
          SELECT 
            t.id, t.todoTitle,
            td.id as todoDetailId, td.todoDescription
          FROM todos t 
          LEFT JOIN todos_detail td ON t.id = td.todoId; 
        `);

        if (getAll) {
          return res.status(200).json(getAll);
        }
      } catch (error) {
        return res.status(400).json("Something went wrong!");
      }
    });
  },
  deleted: (req, res) => {
    connDB.getConnection(async (err, conn) => {
      const { id } = req.params;

      if (err) throw err;

      try {
        await conn
          .promise()
          .query(
            `
            DELETE FROM todos_detail WHERE todoId = '${id}';
          `
          )
          .then(async () => {
            await conn.promise().query(`
            DELETE FROM todos WHERE id = '${id}';
          `);
          });

        return res.status(200).json("Deleted successfully!");
      } catch (error) {
        return res.status(400).json("Something went wrong!");
      }
    });
  },
  updated: (req, res) => {
    connDB.getConnection(async (err, conn) => {
      const { id } = req.params;
      const { todoTitle, todoDescription, isDone } = req.body;

      if (err) throw err;

      try {
        const editTodosDetail = await conn.promise().query(`
          UPDATE todos_detail SET todoDescription = '${todoDescription}' WHERE todoId = '${id}';
        `);

        const editTodos = await conn.promise().query(`
          UPDATE todos SET todoTitle = '${todoTitle}', isDone = ${isDone} WHERE id = '${id}';
        `);

        if (editTodosDetail && editTodos) {
          return res.status(200).json("Update successfully");
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json("Something went wrong!");
      }
    });
  },
};
