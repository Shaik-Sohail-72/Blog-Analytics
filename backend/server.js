const express = require('express');
const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

const data = async () => {
    try {
        const response = await axios.get(process.env.HASURA_API_URL, {
            headers: {
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch blog data');
    }
};

const memoData = _.memoize(data, () => 'blogData', 300000);

app.get('/api/blog-stats', async (req, res) => {
    try {
        const blogData = await memoData();
        const totalBlogs = blogData.blogs.length;
        const longestTitleBlog = _.maxBy(blogData.blogs, blog => blog.title.length);
        const privacyBlogs = _.filter(blogData.blogs, blog => {
            return blog.title && blog.title.toLowerCase().includes('privacy');
        });
        const uniqueTitles = _.uniqBy(blogData.blogs, 'title').map(blog => blog.title).filter(Boolean);

        const responseStats = {
            totalBlogs,
            longestTitle: longestTitleBlog ? longestTitleBlog.title : null,
            privacyBlogsCount: privacyBlogs.length,
            uniqueTitles
        };
        res.json(responseStats);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/blog-search', async (req, res) => {
  try {
      const query = req.query.query.toLowerCase(); 
      const blogData = await memoData();
      const searchResults = blogData.blogs.filter(blog => {
          return blog.title.toLowerCase().includes(query);
      });
      res.json({ searchResults });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});