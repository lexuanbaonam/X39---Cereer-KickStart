import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề của sự kiện
    description: { type: String }, // Mô tả chi tiết
    startDate: { type: Date, required: true }, // Ngày bắt đầu của sự kiện
    endDate: { type: Date, required: true }, // Ngày kết thúc của sự kiện
    tasksId: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Tasks'} ], // Danh sách công việc liên quan
})

const timelineModel = mongoose.model('Timelines', timelineSchema);
export default timelineModel;