import api from './axios'; // ← même instance, token inclus automatiquement

export const getNotifications  = ()      => api.get('/notifications');
export const markAsRead        = (id)    => api.put(`/notifications/${id}/read`);
export const sendNotification  = (data)  => api.post('/notifications', data);