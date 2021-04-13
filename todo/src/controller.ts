import express from 'express';
import Todo from './model'

class Controller {
  router = express.Router();

  constructor(){
    this.router.get('/todos', this.getTodos)
    this.router.get('/todo/:id', this.getTodo)
    this.router.post('/todo', this.createTodo)
    this.router.patch('/todo/:id', this.updateTodo)
    this.router.delete('/todo/:id', this.deleteTodo)
  }

  getTodos = async (req, res) => {
    try {
      const todos = await Todo.find();
      res.send({
        status: "success",
        message: "Todos retrieved succesfully",
        data: todos,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  getTodo = async (req, res) => {
    try {
      const { id } = req.params
      const todo = await Todo.findById(id);
      res.send({
        status: "success",
        message: "Todo retrieved succesfully",
        data: todo,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  createTodo = async (req, res) => {
    try {
      const todo = await Todo.create(req.body);

      res.send({
        status: "success",
        message: "Todo created succesfully",
        data: todo,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  updateTodo = async (req, res) => {
    try {
      const { id } = req.params

      const todo = await Todo.findById(id);
  
      if (!todo)
        return res.send({
          status: "fail",
          message: `Todo with id: ${id} not found`,
        });

      await Todo.findByIdAndUpdate(id, req.body);

      res.send({
        status: "success",
        message: "Todo updated succesfully",
        data: todo,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  deleteTodo = async (req, res) => {
    try {
      const { id } = req.params;
  
      await Todo.findByIdAndDelete(id);
  
      res.send({
        status: "success",
        message: "Todo deleted succesfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  };
  
}

export default Controller;
