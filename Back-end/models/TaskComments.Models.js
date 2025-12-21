import mongoose from 'mongoose';

const taskCommentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasks', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replyComment: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskComments' } // phản hồi bình luận
});

const taskCommentModel = mongoose.model('TaskComments', taskCommentSchema);
export default taskCommentModel
