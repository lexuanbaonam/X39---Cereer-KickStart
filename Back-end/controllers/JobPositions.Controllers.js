import jobPositionModel from "../models/JobPositions.Models.js";

const jobPositionController = {
    createJobPosition: async (req, res) => {
        const { title, code, describe } = req.body;

        if (!title || !code) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        try {
            const existingJobPosition = await jobPositionModel.findOne({ code });
            if (existingJobPosition) {
                return res.status(400).json({ message: 'Mã chức vụ đã tồn tại.' });
            }

            const newJobPosition = await jobPositionModel.create({
                title,
                code,
                describe
            });

            res.status(201).json({ message: 'Chức vụ đã được tạo thành công.', jobPosition: newJobPosition });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },
    getAllJobPositions: async (req, res) => {
        try {
            const jobPositions = await jobPositionModel.find();
            res.status(200).json({ jobPositions });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },
}

export default jobPositionController;