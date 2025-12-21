import courseModel from "../models/Courses.Models";

const courseController = {
    createCourse: async (req, res) => {
        const { depart, name, levelNumber, code, describe } = req.body;
        if (!name) return res.status(400).json({ message: "Hãy điền tên khóa học" });
        if (!code) return res.status(400).json({ message: "Hãy điền mã khóa học" });
        if (!levelNumber && levelNumber !== 0) return res.status(400).json({ message: "Hãy điền mức độ đào tạo" });
        const existingCourse = await courseModel.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ message: "Mã khóa học đã tồn tại" });
        }
        try {
            const newCourse = new courseModel({ depart, name, levelNumber, code, describe });
            await newCourse.save();
            return res.status(201).json({ message: "Tạo khóa học thành công", data: newCourse });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    getAllCourses: async (req, res) => {
        try {
            const courses = await courseModel.find().populate('depart');
            return res.status(200).json({ message: "Lấy danh sách khóa học thành công", data: courses });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    getCourseById: async (req, res) => {
        const { id } = req.params;
        try {
            const course = await courseModel.findById(id).populate('depart');
            if (!course) {
                return res.status(404).json({ message: "Khóa học không tồn tại" });
            }
            return res.status(200).json({ message: "Lấy khóa học thành công", data: course });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    deleteCourse: async (req, res) => {
        const { id } = req.params;
        try {
            const course = await courseModel.findByIdAndDelete(id);
            if (!course) {
                return res.status(404).json({ message: "Khóa học không tồn tại" });
            }
            return res.status(200).json({ message: "Xóa khóa học thành công", data: course });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    }
}

export default courseController;