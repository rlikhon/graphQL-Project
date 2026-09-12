const User = require('../../models/User'); 
const Post = require('../../models/Post');

const postResolvers = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        getPost: async (_, { id }) => {
            try {
                const post = await Post.findById(id);
                if (!post) {
                    throw new Error('Post not found');
                }
                return post;
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
    Mutation: {
        createPost: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Unauthorized: You must be logged in to create a post');
            }

            const { title, content } = input;

            if (!title || !content) {
                throw new Error('Title and content are required');
            }

            try {
                const newPost = new Post({ title, content, author: user.userId });
                await newPost.save();
                return newPost;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        updatePost: async (_, { id, input }, { user }) => {
            if (!user) {
                throw new Error('Unauthorized: You must be logged in to create a post');
            }

            const { title, content } = input;

            if (!title || !content) {
                throw new Error('Title and content are required');
            }

            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    id,
                    { title, content },
                    { new: true }
                );
                if (!updatedPost) {
                    throw new Error('Post not found');
                }
                return updatedPost;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        deletePost: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Unauthorized: You must be logged in to create a post');
            }

            try {
                const deletedPost = await Post.findByIdAndDelete(id);
                if (!deletedPost) {
                    throw new Error('Post not found');
                }
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
    // 🛰️ RELATIONSHIP RESOLVER: Maps the stored ID into a full User model object
    Post: {
        author: async (parent) => {
            try {
                if (!parent.author) {
                    throw new Error('No author reference found on this post document.');
                }
                
                // This line will now run perfectly because 'User' is imported above
                const authorData = await User.findById(parent.author);
                
                if (!authorData) {
                    return {
                        id: parent.author.toString(),
                        name: "Anonymous",
                        email: "No email"
                    };
                }

                return authorData;
            } catch (error) {
                throw new Error(`Failed to resolve post author: ${error.message}`);
            }
        }
    }
};

module.exports = postResolvers;