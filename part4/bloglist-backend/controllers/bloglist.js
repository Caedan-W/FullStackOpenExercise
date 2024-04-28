const bloglistRouter = require('express').Router()
const Blog = require('../models/bloglist')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')



bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  //console.log('blogs: ', blogs)
  response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


bloglistRouter.post('/', async (request, response) => {
  // const decodedToken = jwt.verify(request.token, config.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  const user = request.user

  const body = request.body
  if (!body.likes) {
    body.likes = 0
  }
  else if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog(body)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


bloglistRouter.delete('/:id', async (request, response) => {
  // const decodedToken = jwt.verify(request.token, config.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized user' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


bloglistRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = bloglistRouter