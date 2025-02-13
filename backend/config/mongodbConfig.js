const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.mongoDbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false, // Set autoIndex to false
        });
        const db = mongoose.connection;

        // Check if collections exist before creating them
        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log("collections", collections)

        if (!collections.some((coll) => coll.name === 'users')) {
            console.log("Users")
            await db.createCollection('users');
        }

        if (!collections.some((coll) => coll.name === 'messages')) {
            await db.createCollection('messages');
            await db.collection("messages").createIndex({ sender: 1, receiver: 1 });
        }

        if (!collections.some((coll) => coll.name === 'contacts')) {
            await db.createCollection('contacts');
        }

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if unable to connect to the database
    }
};

module.exports = { connectToDatabase };
