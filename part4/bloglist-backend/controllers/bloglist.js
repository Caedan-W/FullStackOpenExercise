// const bloglistRouter = require('express').Router()
// const Blog = require('../models/bloglist')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// const config = require('../utils/config')
// const userExtractor = require('../utils/middleware').userExtractor



// bloglistRouter.get('/', async (request, response) => {
//   const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
//   //console.log('blogs: ', blogs)
//   response.json(blogs)
// })

// bloglistRouter.get('/:id', async (request, response) => {
//   const blog = await Blog.findById(request.params.id)
//   if (blog) {
//     response.json(blog)
//   } else {
//     response.status(404).end()
//   }
// })


// bloglistRouter.post('/', async (request, response) => {
//   const user = request.user

//   const body = request.body
//   if (!body.likes) {
//     body.likes = 0
//   }
//   else if (!body.title || !body.url) {
//     return response.status(400).json({ error: 'title or url missing' })
//   }

//   const blog = new Blog(body)
//   const savedBlog = await blog.save()
//   console.log('user', user)
//   console.log(typeof user)
//   console.log('user.blogs', user.blogs)
//   user.blogs = user.blogs.concat(savedBlog._id)
//   //user.blogs = (user.blogs || []).concat(savedBlog._id)
//   console.log('user.blogs', user.blogs)
//   await user.save()
//   response.status(201).json(savedBlog)
// })



// bloglistRouter.delete('/:id', async (request, response) => {
//   // const decodedToken = jwt.verify(request.token, config.SECRET)
//   // if (!decodedToken.id) {
//   //   return response.status(401).json({ error: 'token invalid' })
//   // }
//   // const user = await User.findById(decodedToken.id)
//   const user = request.user
//   const blog = await Blog.findById(request.params.id)
//   if (blog.user.toString() !== user.id.toString()) {
//     return response.status(401).json({ error: 'unauthorized user' })
//   }
//   await Blog.findByIdAndDelete(request.params.id)
//   response.status(204).end()
// })


// bloglistRouter.put('/:id', async (request, response) => {
//   const body = request.body
//   const blog = {
//     likes: body.likes
//   }
//   const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//   response.json(updatedBlog)
// })


// module.exports = bloglistRouter







const jwt = require('jsonwebtoken')
const bloglistRouter = require('express').Router()
const Blog = require('../models/bloglist')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

bloglistRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

bloglistRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  const user = request.user

  if (!user ) {
    return response.status(403).json({ error: 'user missing' })
  }  

  if (!blog.title || !blog.url ) {
    return response.status(400).json({ error: 'title or url missing' })
  }   

  blog.likes = blog.likes | 0
  blog.user = user
  console.log('blog.user', blog.user)
  console.log('typeof blog.user', typeof blog.user)
  console.log(user instanceof User) // Assuming User is your Mongoose model
  user.blogs = user.blogs.concat(blog._id)

  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  if ( user.id.toString() !== blog.user.toString() ) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  await blog.deleteOne()

  user.blogs = user.blogs.filter(b => b._id.toString() !== blog._id.toString())

  await user.save()

  response.status(204).end()
})

bloglistRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  console.log('blog', blog)


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = bloglistRouter