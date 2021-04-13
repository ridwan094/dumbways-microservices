import express from 'express';
import Joi from 'joi'
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import User from './model'
import { SECRET_KEY } from './config.json'

class Controller {
  router = express.Router();

  constructor(){
    this.router.get('/users', this.getUsers)
    this.router.get('/user/:id', this.getUser)
    this.router.post('/user', this.createUser)
    this.router.post('/register', this.register)
    this.router.post('/login', this.login)
    this.router.patch('/user/:id', this.updateUser)
    this.router.delete('/user/:id', this.deleteUser)
  }

  getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.send({
        status: "success",
        message: "Users retrieved succesfully",
        data: users,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  getUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findById(id);
      res.send({
        status: "success",
        message: "User retrieved succesfully",
        data: user,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  register = async (req, res) => {
    try {
      const { email, password, name } = req.body

      const schema = Joi.object({
        email: Joi.string().email().min(10).max(30).required(),
        password: Joi.string().min(6).max(50).required(),
        name: Joi.string().min(3).max(50).required(),
      });
  
      const { error } = schema.validate({ email, password, name });
  
      if (error)
        return res.status(400).send({
          status: "validation failed",
          message: error.details[0].message,
        });

      const checkEmail = await User.findOne({ email });
  
      if (checkEmail)
        return res.status(400).send({
          status: "fail",
          message: "Email has been used",
        });

      const hashStrength = 10;
      const hashedPassword = await bcrypt.hash(password, hashStrength);

      const user = await User.create({ ...req.body, password: hashedPassword });

      const token = jwt.sign({ id: user.id }, SECRET_KEY);

      res.send({
        status: "success",
        message: "User created succesfully",
        data: {
          user,
          token
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const schema = Joi.object({
        email: Joi.string().email().min(10).max(50).required(),
        password: Joi.string().min(8).required(),
      });
  
      const { error } = schema.validate(req.body);
  
      if (error)
        return res.status(400).send({
          status: "validation failed",
          message: error.details[0].message,
        });
  
      const user = await User.findOne({ email })
  
      if (!user)
        return res.status(400).send({
          status: "Login Failed",
          message: "Your Credentials is not Valid",
        });
  
      const isValidPass = await bcrypt.compare(password, user.password);
  
      if (!isValidPass) {
        return res.status(400).send({
          status: "Login Failed",
          message: "Your Credentials is not Valid",
        });
      }
  
      const secretKey = SECRET_KEY;
      const token = jwt.sign({ id: user.id }, secretKey);
  
      res.send({
        status: "success",
        message: "Login Success",
        data: {
          user,
          token
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  };

  createUser = async (req, res) => {
    try {
      const { email, password, name, phone } = req.body

      const schema = Joi.object({
        email: Joi.string().email().min(10).max(30).required(),
        password: Joi.string().min(6).max(50).required(),
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(10).max(13).required(),
      });
  
      const { error } = schema.validate({ email, password, name, phone });
  
      if (error)
        return res.status(400).send({
          status: "validation failed",
          message: error.details[0].message,
        });

      const input = {
        email,
        password,
        name: "CANDIDATE" + name,
        phone,
      };
  
      const user = await User.create(input);

      res.send({
        status: "success",
        message: "User created succesfully",
        data: user,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  updateUser = async (req, res) => {
    try {
      const { id } = req.params

      const user = await User.findById(id);
  
      if (!user)
        return res.send({
          status: "fail",
          message: `User with id: ${id} not found`,
        });

      await User.findByIdAndUpdate(id, req.body);

      res.send({
        status: "success",
        message: "User updated succesfully",
        data: user,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      await User.findByIdAndDelete(id);
  
      res.send({
        status: "success",
        message: "User deleted succesfully",
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
