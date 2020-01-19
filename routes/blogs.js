
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

    router.get('/singleBlog/:id', (req, res) => {
        if(!req.params.id) {
            res.json({success: false, message: 'No blog id was provided'});
        } else {
            Blog.find({_id: req.params.id }, (err, blog) => {
                if(err) {
                    res.json({success: false, err});
                } else {
                    if (!blog) {
                        res.json({success: false, message: 'Blog not found'});
                    } else {
                        res.json({success: true, blog: blog});
                    }
                }
            });
        }
    });

    router.put('/updateBlog', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
          res.json({ success: false, message: 'No blog id provided' }); // Return error message
        } else {
          // Check if id exists in database
          Blog.findOne({ _id: req.body._id }, (err, blog) => {
            // Check if id is a valid ID
            if (err) {
              res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
            } else {
              // Check if id was found in the database
              if (!blog) {
                res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
              } else {
                // Check who user is that is requesting blog update
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user logged in the the one requesting to update blog post
                      if (user.username !== blog.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                      } else {
                        blog.title = req.body.title; // Save latest blog title
                        blog.body = req.body.body; // Save latest body
                        blog.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Please ensure form is filled out properly' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });

  return router;
}