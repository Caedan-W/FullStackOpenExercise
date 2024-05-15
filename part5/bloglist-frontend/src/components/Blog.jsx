const BlogDetails = ({ blog, handleLike, handleRemove }) => {
  return (
    <div>
      <a href={blog && blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={()=>handleLike(blog)}>like</button></p>
      <p>{blog.author}</p>
      <button onClick={() => handleRemove(blog.id)}>remove</button>
    </div>
  )
}

const Blog = ({ blog, blogDetailsVisible, setBlogDetailsVisible, handleLike, handleRemove }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button
        onClick={() => setBlogDetailsVisible({ ...blogDetailsVisible, [blog.id]: !blogDetailsVisible[blog.id] })}>
        {blogDetailsVisible[blog.id] ? 'hide' : 'view'}
      </button>
      {blogDetailsVisible[blog.id]
        &&
      <BlogDetails blog={blog} handleLike={handleLike} handleRemove={handleRemove}/>}
    </div>
  )
}

export default Blog