import api from './axios';

export const getNotifications   = ()     => api.get('/notifications');
export const markAsRead         = (id)   => api.put(`/notifications/${id}/read`);
export const sendNotification   = (data) => api.post('/notifications', data);
export const deleteNotification = (id)   => api.delete(`/notifications/${id}`);