const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const result = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return result
}


const favoriteBlog = (blogs) => {
  // 使用 reduce() 方法找到点赞数最大的博客
  const mostLikedBlog = blogs.reduce((maxLikedBlog, blog) => {
    if (blog.likes > maxLikedBlog.likes) {
      return blog;
    } else {
      return maxLikedBlog;
    }
  }, { likes: -Infinity }); // 使用 -Infinity 作为初始值，确保第一个博客被视为最受欢迎的博客
  /**
   * 确保在第一次迭代中，任何博客的点赞数（即使是 0）都会被视为大于初始值，从而将其设置为当前最受欢迎的博客。
   * 后续的迭代将比较每个博客的点赞数与当前最受欢迎的博客的点赞数，并更新 maxLikedBlog，最终找到点赞数最多的博客。
   */
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author, 
    likes: mostLikedBlog.likes
  }
}



const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

/*
const authorArray = (blogs) => {
  return blogs.reduce((author, blog) => {
    author = Array.isArray(author) ? author : []
    author.push(blog.author)
    return author
  }, [])
}

const authorBlogsTable = (blogs) => {
  const authorList = authorArray(blogs)

  //create a hash table to store the author and the number of blogs
  const table = authorList.reduce((nums, author) => {
    if (author in nums){
      nums[author]++
    }
    else {
      nums[author] = 1
    }
    return nums 
  },{})

  return table
}

const authorWithMostBlogs = (blogs) => {
  const table = authorBlogsTable(blogs)
  const maxBlogs = Math.max(...Object.values(table))
  const author = Object.keys(table).find(key => table[key] === maxBlogs)
  return { 
    author: author,
    blogs: maxBlogs 
  }
}
*/


//use Lodash library to get the author with the most blogs
const _ = require('lodash')

const authorWithMostBlogs = (blogs) => {
  const author = _.chain(blogs)
    .groupBy('author') // Group blogs by author
    .map((blogs, author) => ({ author, blogs: blogs.length })) // Map to an array of objects with author and blog count
    .maxBy('blogs') // Find the author with the most blogs
    .value() // Extract the value from the lodash wrapper object

  return author
}
    

const authorWithMostLikes = (blogs) => {
  const author = _.chain(blogs)
    .groupBy('author') // Group blogs by author
    .map((blogs, author) => ({ author, likes: _.sumBy(blogs, 'likes') })) // Map to an array of objects with author and total likes
    .maxBy('likes') // Find the author with the most likes
    .value() // Extract the value from the lodash wrapper object

  return author
}




module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  authorWithMostLikes
}