import Task from "../models/Tasks.Models.js";
import taskCommentModel from "../models/TaskComments.Models.js";

const taskCommentController = {
  commentOnTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ message: "Không tìm thấy công việc" });

      const comment = {
        userId: req.user.id,
        content: req.body.comment,
        date: new Date(),
      };
      task.comments.push(comment);
      await task.save();

      res.status(200).json({ message: "Đã thêm bình luận", task });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi bình luận công việc", error: err.message });
    }
  }
};

export default taskCommentController;
