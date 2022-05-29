import mongoose from 'mongoose'

// TODO config
const connectionString = 'mongodb://localhost:27017/myapp'

mongoose.connect(connectionString);
