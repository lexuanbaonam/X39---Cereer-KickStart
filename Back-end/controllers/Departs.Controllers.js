import departModel from "../models/Departs.Models.js";

const departController = {
    createDepart: async (req, res) => {
        const { title, code, describe } = req.body
        if (!title) return res.status(400).json({ message: "Hãy điền tên phòng ban" });
        if (!code) return res.status(400).json({ message: "Hãy điền mã phòng ban" });

        const existingDepart = await departModel.findOne({ code });
        if (existingDepart) {
            return res.status(400).json({ message: "Mã phòng ban đã tồn tại" });
        }

        try {
            const newDepart = new departModel({ title, code, describe });
            await newDepart.save();
            return res.status(201).json({ message: "Tạo phòng ban thành công", data: newDepart });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    getAllDeparts: async (req, res) => {
        try {
            const departs = await departModel.find();
            return res.status(200).json({ message: "Lấy danh sách phòng ban thành công", data: departs });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    getDepartById: async (req, res) => {
        const { id } = req.params;
        try {
            const depart = await departModel.findById(id);
            if (!depart) {
                return res.status(404).json({ message: "Phòng ban không tồn tại" });
            }
            return res.status(200).json({ message: "Lấy phòng ban thành công", data: depart });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
    deleteDepart: async (req, res) => {
        const { id } = req.params;
        try {
            const depart = await departModel.findByIdAndDelete(id);
            if (!depart) {
                return res.status(404).json({ message: "Phòng ban không tồn tại" });
            }
            return res.status(200).json({ message: "Xóa phòng ban thành công", data: depart });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    }
}

export default departController;