import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // người tạo dự án
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    sprintId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprints' }], // danh sách sprint liên quan
})

const projectModel = mongoose.model('Projects', projectSchema);
export default projectModel;