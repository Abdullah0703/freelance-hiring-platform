'use strict';

const { error } = require('winston');
const Message = require('../models/messageMongooseModel.js');
const Contact = require('../models/contactMongooseModel.js');
const User = require('../models/userMongooseModel.js');
const UserE = require('../models/userModel');

class ChatController {
    static async getContacts(req, res) {
        try {
            const userId = req.params.userId;
            console.log("getContacts-userId", userId);

            const contact = await Contact.findOne({ user: userId }).populate({
                path: "contacts",
                select: "email username _id",
            });

            if (!contact) {
                return res.json([]);
            }

            const contactsData = await Promise.all(
                contact.contacts.map(async (contact) => {
                    const lastMessage = await Message.findOne({
                        $or: [
                            { sender: userId, receiver: contact._id },
                            { sender: contact._id, receiver: userId },
                        ],
                    }).sort({ createdAt: -1 });

                    const lastMessageData = lastMessage
                        ? {
                            content: lastMessage.content || 'FILE',
                            createdAt: lastMessage.createdAt,
                        }
                        : {
                            content: '',
                            createdAt: '',
                        };

                    return {
                        email: contact.email,
                        username: contact.username,
                        name: contact.name,
                        id: contact._id,
                        lastMessage: lastMessageData,
                    };
                })
            );

            res.json(contactsData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    }


    static async addContacts({ userId, contactId }) {
        try {
            const user = await User.findById(contactId);
            if (!user) {
                throw new Error("User not found");
            }

            let contact = await Contact.findOne({ user: userId });
            if (!contact) {
                contact = new Contact({ user: userId, contacts: [contactId] });
            } else {
                if (contact.contacts.includes(contactId)) {
                    return; // Contact already exists, no need to add again
                }
                contact.contacts.push(contactId);
            }

            await contact.save();

            return contact;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async deleteContacts(req, res) {
        try {
            const { contact_id } = req.params;
            const userId = req.body.userId;

            const contact = await Contact.findOne({ user: userId });

            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }

            const contactIndex = contact.contacts.findIndex(
                (id) => id == contact_id
            );

            if (contactIndex === -1) {
                return res.status(404).json({ error: 'Contact not found', message: 'No changes made' });
            }

            contact.contacts.splice(contactIndex, 1);
            await contact.save();

            res.status(200).json({ message: 'Contact deleted successfully', deleted_contact_id: contact_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error', message: 'Failed to delete contact' });
        }
    }

    static async getMsg(req, res) {
        try {
            let response;
            const { userId } = req.body;
            let { sender, receiver } = req.params;
            if (typeof sender !== 'string' || typeof receiver !== 'string') {
                sender = parseInt(sender);
                receiver = parseInt(receiver);
            }

            const messages = await Message.find({
                $or: [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender },
                ],
            }).sort({ createdAt: 1 });

            response = messages;
            res.send(response);

        } catch (error) {
            console.log(error);
            return res.status.send(error);
        }
    }

    static async sendMsg(req, res) {
        try {
            const { sender, receiver, content } = req.body;
            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) {
                return res.status(404).json({ error: "Sender or receiver not found" });
            }

            const message = await ChatController.saveMessage(sender, receiver, content, req.file);

            await ChatController.updateContacts(sender, receiver); // Fixed this line


            res.json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server Error" });
        }
    }


    static async saveMessage(sender, receiver, content, file) {
        try {
            let message;
            if (file) {
                const { filename } = file;
                console.log("file passed", filename);
                message = new Message({
                    sender,
                    receiver,
                    content,
                    fileType: file.mimetype,
                    filePath: `uploads/${filename}`,
                });
            } else {
                message = new Message({
                    sender,
                    receiver,
                    content,
                });
            }

            return await message.save();
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    static async updateContacts(sender, receiver) {
        try {
            const senderUser = await User.findById(sender);
            if (!senderUser) {
                throw new Error("Sender not found");
            }

            await ChatController.handleContactUpdate(sender, receiver);
            await ChatController.handleContactUpdate(receiver, sender);
        } catch (error) {
            console.error("Error updating contacts:", error);
            throw error;
        }
    }

    static async handleContactUpdate(userId, contactId) {
        try {
            let contact = await Contact.findOne({ user: userId });

            if (!contact) {
                contact = new Contact({ user: userId, contacts: [contactId] });
            } else {
                if (!contact.contacts.includes(contactId)) {
                    contact.contacts.push(contactId);
                }
            }

            await contact.save();
        } catch (error) {
            console.error("Error handling contact update:", error);
            throw error;
        }
    }

    static async downloadFile(req, res) {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '../uploads', fileName);

        if (fs.existsSync(filePath)) {
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    }
}

module.exports = ChatController;
