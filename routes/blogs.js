
const Blog = require('./../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        if(!req.body.title) {
            res.json({success: false, message: 'Blog title is required'});
        } else {
            if(!req.body.body) {
                res.json({success: false, message: 'Blog body is required'});
            } else {
                if(!req.body.createdBy) {
                    res.json({success: false, message: 'Blog creator is required'});
                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    }).save((err) => {
                        if(err) {
                            if(err.errors) {
                                if(err.errors.title) {
                                    res.json({success: false, message: err.errors.title.message});
                                } else if(err.errors.body) {
                                    res.json({success: false, message: err.errors.body.message});
                                } else if(err.errors.createdBy) {
                                    res.json({success: false, message: err.errors.createdBy.message});
                                } else {
                                    res.json({success: false, message: err.errmsg});
                                }
                            } else {
                                res.json({success: false, message: err});
                            }
                        } else {
                            res.json({success: true, message: 'Blog saved'});
                        }
                    });
                }
            }
        }
    });

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if(err) {
                res.json({success: true, message: err});
            } else {
                if(!blogs) {
                res.json({success: true, message: 'No blugs'});                    
                } else {
                    res.json({success: true, blogs: blogs});
                }
            }
        }).sort({'_id' : -1});
    });

  return router;
}