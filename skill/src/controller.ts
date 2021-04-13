import express from 'express';
import Skill from './model'

class Controller {
  router = express.Router();

  constructor(){
    this.router.get('/skills', this.getSkills)
    this.router.get('/skill/:id', this.getSkill)
    this.router.post('/skill', this.createSkill)
    this.router.patch('/skill/:id', this.updateSkill)
    this.router.delete('/skill/:id', this.deleteSkill)
  }

  getSkills = async (req, res) => {
    try {
      const skills = await Skill.find();
      res.send({
        status: "success",
        message: "Skills retrieved succesfully",
        data: skills,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  getSkill = async (req, res) => {
    try {
      const { id } = req.params
      const skill = await Skill.findById(id);
      res.send({
        status: "success",
        message: "Skill retrieved succesfully",
        data: skill,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  createSkill = async (req, res) => {
    try {
      const skill = await Skill.create(req.body);

      res.send({
        status: "success",
        message: "Skill created succesfully",
        data: skill,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  updateSkill = async (req, res) => {
    try {
      const { id } = req.params

      const skill = await Skill.findById(id);
  
      if (!skill)
        return res.send({
          status: "fail",
          message: `Skill with id: ${id} not found`,
        });

      await Skill.findByIdAndUpdate(id, req.body);

      res.send({
        status: "success",
        message: "Skill updated succesfully",
        data: skill,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  deleteSkill = async (req, res) => {
    try {
      const { id } = req.params;
  
      await Skill.findByIdAndDelete(id);
  
      res.send({
        status: "success",
        message: "Skill deleted succesfully",
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
