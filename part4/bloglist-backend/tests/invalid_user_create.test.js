const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./api_test_helper')
const User = require('../models/user')

describe.only('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '123456'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('expected `username` to be unique'))
  })

  test.only('creation fails with proper statuscode and message if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: '123456'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('username must be at least 3 characters long'))
  })

  test.only('creation fails with proper statuscode and message if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '12'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('password must be at least 3 characters long'))
  })
})



after(async () => {
  await mongoose.connection.close()
})