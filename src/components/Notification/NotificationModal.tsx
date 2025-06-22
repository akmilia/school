import { useState, useEffect } from 'react';
import cl from './NotificationModal.module.css';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

const NotificationsModal = ({ onClose }: { onClose: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifs => 
      notifs.map(n => n.id === id ? {...n, read: true} : n)
    );
  };

  return (
    <div className={cl.overlay} onClick={onClose}>
      <div className={cl.modal} onClick={e => e.stopPropagation()}>
        <button className={cl.closeBtn} onClick={onClose}>×</button>
        <h2>Уведомления</h2>
        
        <div className={cl.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`${cl.notification} ${!notification.read ? cl.unread : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <p>{notification.message}</p>
                <span className={cl.date}>{notification.date}</span>
              </div>
            ))
          ) : (
            <p>Нет новых уведомлений</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;