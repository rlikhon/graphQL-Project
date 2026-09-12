const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const { 
    ValidationError, 
    NotFoundError, 
    AuthenticationError, 
    ForbiddenError, 
    DuplicateError } = require('../../utils/errors');

//const pubsub = require('../../pubsub');
const pubsub = new PubSub();

const USER_CREATED = 'USER_CREATED';

const userResolver = {
    Query: {
        getUsers: async (_, { page = 1, limit = 10 }, { user }) => {            
            //if (!user) {
            //////    throw new AuthenticationError('Unauthorized: Please log in to view users');
            //}
            
            const safePage = Math.max(1, page);
            const safeLimit = Math.max(1, Math.min(limit, 50)); // Prevent client from passing limit=1000000

            try {        
                // 2. PERFORMANCE FIX: Execute both database operations concurrently
                const [totalUsers, users] = await Promise.all([
                    User.countDocuments(),
                    User.find()
                        .sort({ createdAt: -1 })
                        .skip((safePage - 1) * safeLimit)
                        .limit(safeLimit)
                ]);
                
                const totalPages = Math.ceil(totalUsers / safeLimit) || 1;
                
                return { 
                    docs: users, 
                    totalDocs: totalUsers, 
                    totalPages, 
                    currentPage: safePage 
                };                
            } catch (error) {
                throw new InternalServerError("Error fetching users: " + error.message);
            }
        },
        getUser: async (_, { id }, { user }) => {
            if (!user) {
                throw new AuthenticationError();
            }
            try {
                const user = await User.findById(id);
                if (!user) {
                    throw new NotFoundError('User not found');
                }
                return user;
            } catch (error) {
                throw new Error("Error fetching user: " + error.message);
            }
        },    
    },
    Mutation: {
        registerUser: async (_, { input }) => {
            const { name, email, password } = input;

            if (!name || !email || !password) {
                throw new Error('Name, email, and password are required');
            }

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('Email already exists');
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ name, email, password: hashedPassword });
                await newUser.save();

                const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                    expiresIn: '1h' 
                });

                return { token, user: newUser };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        loginUser: async (_, { email, password }) => {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }

                const isPasswordMatch = await bcrypt.compare(password, user.password);
                if (!isPasswordMatch) {
                    throw new Error('Invalid password');
                }

                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                        expiresIn: '1d' 
                    });

                return { token, user };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        createUser: async (_, { input }) => {
            const { name, email, password } = input;
            const validationErrors = [];

            if (!name) {
                validationErrors.push({ field: 'name', error: 'Name is required' });
            }
            
            if (!email) {
                validationErrors.push({ field: 'email', error: 'Email address is required' });
            } else if (!email.includes('@')) {
                validationErrors.push({ field: 'email', error: 'Please enter a valid email address' });
            }

            if (!password) {
                validationErrors.push({ field: 'password', error: 'Password is required' });
            } else if (password.length < 6) {
                validationErrors.push({ field: 'password', error: 'Password must be at least 6 characters long' });
            }

            // 2. If errors exist, stop execution and throw our detailed list
            if (validationErrors.length > 0) {
                throw new ValidationError('Form validation failed', validationErrors);
            }

            try {            
                const existingUser = await User.findOne({ email: input.email });
                if (existingUser) {
                    throw new DuplicateError('An account with this email address already exists');
                }

                const newUser = new User(input);
                await newUser.save();
                await pubsub.publish(USER_CREATED, { userCreated: newUser });
                return newUser;
            } catch (error) {
                if(error instanceof ValidationError) {
                    const details = Object.keys(error.errors).map(field => ({
                        field,
                        error: error.errors[field].message    
                    }));
                    throw new ValidationError(error.message, details);
                }

                if(error instanceof DuplicateError) {
                    throw new DuplicateError(error.message);
                }
                        
                throw new Error(error.message);
            }
        },
        updateUser: async (_, { id, input }) => {        
            if (!input.name && !input.email) {
                throw new Error('At least name or email is required');
            }

            try {            
                if (input.email) {
                    const emailOwner = await User.findOne({ email: input.email });            
                    if (emailOwner && emailOwner._id.toString() !== id) {
                        throw new Error('Email is already taken by another account');
                    }
                }
                
                const updatedUser = await User.findByIdAndUpdate(
                    id, 
                    { $set: input }, 
                    { new: true, runValidators: true } 
                );
                
                if (!updatedUser) {
                    throw new Error('User not found');
                }

                return updatedUser;

            } catch (error) {            
                throw new Error(error.message);
            }
        },    
        deleteUser: async (_, { id }) => {
            try {
                const deletedUser = await User.findByIdAndDelete(id);
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    Subscription: {
        userCreated: {
            subscribe: () => pubsub.asyncIterableIterator([USER_CREATED])
        }
    }
};

module.exports = userResolver;