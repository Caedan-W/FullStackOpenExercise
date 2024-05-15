import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const [blogDetailsVisible, setBlogDetailsVisible] = useState({})
  const [sorted, setSorted] = useState(false)

  const changeSuccessMessage = (successMessage) => {
    setNotificationMessage(
      successMessage
    )
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const changeFailMessage = (failMessage) => {
    setNotificationMessage(
      failMessage
    )
    setNotificationType('error')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    console.log('new blog:', newBlog)
  }, [newBlog])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      changeSuccessMessage('Logged in')
    } catch (exception) {
      changeFailMessage('Wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try{
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setNewBlog({ title: '', author: '', url: '' })
      changeSuccessMessage(`A new blog ${blog.title} by ${blog.author} added`)
    }
    catch(exception){
      console.log('exception:', exception)
      changeFailMessage('Failed to add blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const handleBlogTitleChange = (event) => {
    console.log('title:', event.target.value)
    setNewBlog({ ...newBlog, title: event.target.value })
  }

  const handleBlogAuthorChange = (event) => {
    console.log('author:', event.target.value)
    setNewBlog({ ...newBlog, author: event.target.value })
  }

  const handleBlogUrlChange = (event) => {
    console.log('url:', event.target.value)
    setNewBlog({ ...newBlog, url: event.target.value })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLike = async (blog) => {
    const updated = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    console.log('updated:', updated)
    try{
      const updatedBlog = await blogService.update(blog.id, updated)
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
    catch(exception){
      console.log('exception:', exception)
      changeFailMessage('Failed to like blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }


  const handleRemove = async (id) => {
    try{
      if (window.confirm(`remove blog ${blogs.find(blog => blog.id === id).title} by ${blogs.find(blog => blog.id === id).author}?`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        changeSuccessMessage('Blog removed')
      }
    }
    catch(exception){
      console.log('exception:', exception)
      changeFailMessage('Failed to remove blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const blogsToRender = sorted ? sortedBlogs : blogs

  return (
    <div>
      {
        user === null ?
          <div>
            <h2>log in to application</h2>
            <Notification message={notificationMessage} type={notificationType}/>
            <LoginForm
              handleSubmit={handleLogin}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              username={username}
              password={password}
            />
          </div>:
          <div>
            <h2>blogs</h2>
            <Notification message={notificationMessage} type={notificationType}/>
            <p>
              {user.name} logged-in
              <button onClick={handleLogout}>logout</button>
            </p>

            <Togglable buttonLabel='create new blog'>
              <BlogForm
                handleCreateBlog={addBlog}
                newBlog={newBlog}
                handleBlogTitleChange={handleBlogTitleChange}
                handleBlogAuthorChange={handleBlogAuthorChange}
                handleBlogUrlChange={handleBlogUrlChange}
              />
            </Togglable>

            <button onClick={() => setSorted(!sorted)}>{sorted ? 'unsort' : 'sort'}</button>
            {blogsToRender.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                blogDetailsVisible={blogDetailsVisible}
                setBlogDetailsVisible={setBlogDetailsVisible}
                handleLike={handleLike}
                handleRemove={handleRemove}
              />
            )}
          </div>
      }
    </div>
  )
}

export default App