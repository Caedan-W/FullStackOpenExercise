const BlogForm = ({
  handleCreateBlog,
  newBlog,
  handleBlogTitleChange,
  handleBlogAuthorChange,
  handleBlogUrlChange
}) => {
  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <p>
        title:
          <input
            value={newBlog.title}
            onChange={handleBlogTitleChange}
            id='title'
          />
        </p>

        <p>
        author:
          <input
            value={newBlog.author}
            onChange={handleBlogAuthorChange}
            id='author'
          />
        </p>

        <p>
        url:
          <input
            value={newBlog.url}
            onChange={handleBlogUrlChange}
            id='url'
          />
        </p>
        <button type="submit">create</button>
      </form>
    </div>
  )}

export default BlogForm
