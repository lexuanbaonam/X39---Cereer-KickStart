import Incident from '../models/Incident.Models.js';

// Tạo sự cố - staff - leader - hệ thống
export const createIncident = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    const incident = new Incident({
      title,
      description,
      type,
      createdBy: req.user._id,
    });

    await incident.save();
    res.status(201).json({ message: 'Tạo ra sự cố', incident });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Lấy danh sách sự cố
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('createdBy', 'fullName role')
      .populate('handledBy', 'fullName role')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Xử lý sự cố
export const handleIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;

    const incident = await Incident.findById(id);
    if (!incident) return res.status(404).json({ message: 'Không tìm thấy sự cố' });

    incident.status = status;
    incident.resolutionNote = resolutionNote;
    incident.handledBy = req.user._id;
    incident.handledAt = new Date();

    await incident.save();
    res.json({ message: 'Cập nhật sự cố', incident });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
