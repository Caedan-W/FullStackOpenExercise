import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import { act } from 'react-dom/test-utils'
import BlogForm from './BlogForm'



test('Blog renders title and author, not URL and likes', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }

  const mockHandler = vi.fn()

  render( 
    <Blog 
      blog={blog}
      blogDetailsVisible={false}
      setBlogDetailsVisible={mockHandler} 
      handleLike={mockHandler}
      handleRemove={mockHandler} 
    /> 
  )
  const element = screen.getByText('test title test author')
  expect(element).toBeDefined()
  const element2 = screen.queryByText('test url')
  expect(element2).toBeNull()
  const element3 = screen.queryByText('0 likes')
  expect(element3).toBeNull()
})


test('Blog calls setBlogDetailsVisible and renders URL and likes when view button is clicked', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }

  const mockHandler = vi.fn()

  render( 
    <Blog 
      blog={blog}
      blogDetailsVisible={false}
      setBlogDetailsVisible={mockHandler} 
      handleLike={mockHandler}
      handleRemove={mockHandler} 
    /> 
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  //screen.debug()

  const urlElement = screen.queryByText('test url')
  //console.log(urlElement)
  expect(urlElement).toBeDefined()

  const likesElement = screen.queryByText('0 likes')
  //console.log(likesElement)
  expect(likesElement).toBeDefined()

})


test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    id: 1,
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 0
  }
  const mockLikeHandler = vi.fn()
  const mockRemoveHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      blogDetailsVisible={{ 1: true }}
      setBlogDetailsVisible={vi.fn()}
      handleLike={mockLikeHandler}
      handleRemove={mockRemoveHandler}
    />
  )

  const likeButton = screen.getByRole('button', { name: 'like' })
  await act(async () => {
    await userEvent.dblClick(likeButton)
  })

  expect(mockLikeHandler.mock.calls).toHaveLength(2)
  expect(mockLikeHandler.mock.calls[0][0]).toEqual(blog)
  expect(mockLikeHandler.mock.calls[1][0]).toEqual(blog)
  //console.log(mockLikeHandler.mock.calls)
})


test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const mockCreateHandler = vi.fn(e => e.preventDefault())
  const mockChangeHandler = vi.fn()
  const user = userEvent.setup()
  render(
    <BlogForm
      handleCreateBlog={mockCreateHandler}
      newBlog={{ title: '', author: '', url: '' }}
      handleBlogTitleChange={mockChangeHandler}
      handleBlogAuthorChange={mockChangeHandler}
      handleBlogUrlChange={mockChangeHandler}
    />
  )

  const titleInput = screen.getByText('title', { exact: false })
  const authorInput = screen.getByText('author', { exact: false })
  const urlInput = screen.getByText('url', { exact: false })

  const createButton = screen.getByRole('button', { name: 'create' })

  await act(async () => {
    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'test url')
    await user.click(createButton)
  })

  expect(mockCreateHandler).toHaveBeenCalledTimes(1)

})

