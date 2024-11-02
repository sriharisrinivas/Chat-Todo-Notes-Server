const TodoModel = require("../models/todo.model");
const userModel = require("../models/user.model");

const fetchTodosController = async (request, response) => {

    try {
        const fetchUserByEmail = await userModel.findOne({ email: request.email });

        let todos = [];
        if (request.body.isFetchAll) {
            todos = await TodoModel.find({ userId: fetchUserByEmail._id });
        } else {
            todos = await TodoModel.aggregate([
                {
                    $match: {
                        userId: fetchUserByEmail._id,
                        task: new RegExp('.*' + request.body.search + '.*', "i"),
                        status: {
                            $in: request.body.status.split(',')
                        },
                        category: {
                            $in: request.body.category.split(',')
                        },
                        dueDate: {
                            $gte: new Date(request.body.fromDate),
                            $lte: new Date(request.body.toDate)
                        }
                    },
                },
                {
                    $sort: {
                        'dueDate': request.body.sortByDate === 'ASC' ? 1 : -1,
                        'severityCode': request.body.sortBySeverity === 'ASC' ? 1 : -1
                    }
                }
            ]);
        }

        todos.forEach((todo) => {
            todo.overdue = ((new Date() - new Date(todo.dueDate) > 0) && todo.status == "New") ? true : false;
        });

        response.status(200).json(todos);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

const createTodoController = async (request, response) => {
    try {
        let userDetails = await userModel.findOne({ email: request.email });

        const todo = await TodoModel.create({ ...request.body, userId: userDetails._id });

        await userModel.updateOne({ _id: userDetails._id }, { $push: { todos: todo._id } });
        response.status(200).json(todo);

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const updateTodoController = async (request, response) => {
    try {
        const todo = await TodoModel.findByIdAndUpdate(request.body._id, request.body, { new: true });
        response.status(200).json(todo);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const deleteTodoController = async (request, response) => { 
    try {
        const todo = await TodoModel.findByIdAndDelete(request.params.id);
        response.status(200).json(todo);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
 }


module.exports = {
    createTodoController,
    updateTodoController,
    fetchTodosController,
    deleteTodoController
};