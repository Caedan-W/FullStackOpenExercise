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
          />
        </p>

        <p>
        author:
          <input
            value={newBlog.author}
            onChange={handleBlogAuthorChange}
          />
        </p>

        <p>
        url:
          <input
            value={newBlog.url}
            onChange={handleBlogUrlChange}
          />
        </p>
        <button type="submit">create</button>
      </form>
    </div>
  )}

export default BlogForm
