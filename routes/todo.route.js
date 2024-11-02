const express = require("express");
const router = express.Router();
const { loginController, createUserController, changePasswordController, resetPasswordController, getProfileController, verifyOtpController, generateOtpController } = require("../controllers/user.controller");
const authenticateToken = require("../middleware/authenticate.middleware");
const { createTodoController, updateTodoController, fetchTodosController, deleteTodoController } = require("../controllers/todo.controller");

/* New Method fetching status with filters */

// router.post("/todos/", authenticateToken, async (request, response) => {
//     const { status, sortBySeverity, search, category, fromDate, toDate, sortByDate } = request.body;

//     let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
//     let getUserDetails = await db.get(getUserDetailsQuery);
//     // let todosQuery = `SELECT * FROM tasks WHERE USER_ID=${getUserDetails.USER_ID} ORDER BY TASK_ID DESC;`;
//     let todosQuery = `SELECT TASK_ID, TITLE, A.DESCRIPTION, STATUS, 
//         B.DT_DESCRIPTION AS STATUS_DESC, SEVERITY, C.DT_DESCRIPTION AS SEVERITY_DESC, 
//         CATEGORY, D.DT_DESCRIPTION AS CATEGORY_DESC, TASK_DATE
//         FROM tasks A
//         LEFT JOIN masters B ON A.STATUS = B.DT_CODE AND B.DETAIL_SEQ_ID = 3
//         LEFT JOIN masters C ON A.SEVERITY = C.DT_CODE AND C.DETAIL_SEQ_ID = 1
//         LEFT JOIN masters D ON A.CATEGORY = D.DT_CODE  AND D.DETAIL_SEQ_ID = 2
//         WHERE USER_ID=${getUserDetails.USER_ID} AND STATUS IN (${status})
//         AND TITLE LIKE '%${search}%' AND CATEGORY IN (${category})
// 		AND DATE(TASK_DATE) BETWEEN DATE('${fromDate}') AND DATE('${toDate}')
//         ORDER BY DATE(TASK_DATE) ${sortByDate}, SEVERITY ${sortBySeverity};`;

//     let todosList = await db.all(todosQuery);
//     // Deleting sensitive information from response
//     todosList.forEach(item => {
//         if (item.USER_ID) {
//             delete item.USER_ID;
//         }
//     });
//     response.send(todosList);
// });

router.post("/fetchTodos/", authenticateToken, fetchTodosController);

router.post("/createTodo/", authenticateToken, createTodoController);

router.put("/updateTodo/", authenticateToken, updateTodoController);

router.delete("/deleteTodo/:id", authenticateToken, deleteTodoController);

module.exports = router;

