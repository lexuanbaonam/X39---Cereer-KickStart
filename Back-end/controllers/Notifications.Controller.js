import Notification from '../models/Notifications.Models.js';

export const getNewNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id, isRead: false });
  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id }, { isRead: true });
  res.json({ message: 'Tất cả thông báo đã được đọc.' });
};

export const deleteNotifications = async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  res.json({ message: 'Xóa tất cả thông báo.' });
};
