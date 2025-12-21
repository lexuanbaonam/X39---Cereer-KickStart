import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // ID của cuộc trò chuyện
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts', required: true }, // Người gửi tin nhắn
    tex: { type: String, required: true }, // Nội dung tin nhắn
    timeStamp: { type: Date, default: Date.now }, // Thời gian gửi tin nhắn
    edited: { type: Boolean, default: false }, // Trạng thái đã chỉnh sửa
    editedAt: { type: Date }, // Thời gian chỉnh sửa tin nhắn
    type: { type: String, enum: ['group', 'p2p'], required: true }
})

const messageModel = mongoose.model('Messages', messageSchema);
export default messageModel;