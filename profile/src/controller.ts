import express from 'express';
import Profile from './model'

class Controller {
  router = express.Router();

  constructor(){
    this.router.get('/profiles', this.getProfiles)
    this.router.get('/profile/:id', this.getProfile)
    this.router.post('/profile', this.createProfile)
    this.router.patch('/profile/:id', this.updateProfile)
    this.router.delete('/profile/:id', this.deleteProfile)
  }

  getProfiles = async (req, res) => {
    try {
      const profiles = await Profile.find();
      res.send({
        status: "success",
        message: "Profiles retrieved succesfully",
        data: profiles,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  getProfile = async (req, res) => {
    try {
      const { id } = req.params
      const profile = await Profile.findById(id);
      res.send({
        status: "success",
        message: "Profile retrieved succesfully",
        data: profile,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  createProfile = async (req, res) => {
    try {
      const profile = await Profile.create(req.body);

      res.send({
        status: "success",
        message: "Profile created succesfully",
        data: profile,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  updateProfile = async (req, res) => {
    try {
      const { id } = req.params

      const profile = await Profile.findById(id);
  
      if (!profile)
        return res.send({
          status: "fail",
          message: `Profile with id: ${id} not found`,
        });

      await Profile.findByIdAndUpdate(id, req.body);

      res.send({
        status: "success",
        message: "Profile updated succesfully",
        data: profile,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        status: "error",
        message: "Server Error",
      });
    }
  }

  deleteProfile = async (req, res) => {
    try {
      const { id } = req.params;
  
      await Profile.findByIdAndDelete(id);
  
      res.send({
        status: "success",
        message: "Profile deleted succesfully",
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
