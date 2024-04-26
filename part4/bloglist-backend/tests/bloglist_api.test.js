const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./api_test_helper') 
const Blog = require('../models/bloglist')


beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})


test('blogs are returned as json', async () => {
  console.log('Entered test\n')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


describe('returns the correct amount of blog posts in the JSON format?', () => {
  test('number and JSON formant', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()
    console.log(blogsAtEnd)
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})


test('the unique identifier property of the blog posts is named id', async () => {
  const blogsAtEnd = await helper.blogsInDb()
  const ids = blogsAtEnd.map(blog => blog.id)
  console.log(ids)
  assert(ids!==undefined, true)
})


test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  const newBlog = {
    title: "test for adding a blog",
    author: "Mike",
    url: "www.google.com",
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)

  const title = blogsAtEnd.map(blog => blog.title)
  assert(title.includes('test for adding a blog'))
})


test('likes property is missing from the request, it will default to the value 0', async () => {
  const blogWithoutLikes = {
    title: "test for adding a blog without likes",
    author: "Alex",
    url: "www.baidu.com"
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const latestBlog = blogsAtEnd[blogsAtEnd.length-1]
  assert.strictEqual(latestBlog.likes, 0)
})


test('title or url properties are missing, responds with the status code 400', async () => {
  const blogWithoutTitle = {
    author: "John",
    url: "www.hao123.com",
    likes: 100
  }

  const blogWithoutUrl = {
    title: "test for adding a blog without url",
    author: "Tom",
    likes: 200
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)

  const blogsAtEnd2 = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd2.length, helper.initialBlogs.length)
})


test.only('deletion of a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})


test.only('updating the amount of likes for a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: 1000 })
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]
  assert.strictEqual(updatedBlog.likes, 1000)
})


after(async () => {
  await mongoose.connection.close()
})






