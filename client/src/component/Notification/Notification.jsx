import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Popover, ListGroup } from "react-bootstrap";
import { IoNotificationsSharp } from "react-icons/io5";
import { fetchGetNotifications, fetchMarkNotificationAsRead, } from "../../services/NotificationService";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const notificationRes = await fetchGetNotifications();
            setNotifications(notificationRes.data.notifications);
        })();
    }, []);

    const handleMarkAsRead = async (notifId) => {
        try {
            const response = await fetchMarkNotificationAsRead(notifId);
            console.log(response)
            if (response.status === 200) {
                setNotifications((prev) =>
                    prev.map((notif) => (notif._id === notifId ? { ...notif, isRead: true } : notif))
                );
                const { classroom, slot } = response.data.notification;
                if (classroom && slot) {
                    navigate(`/classroom/${classroom}/${slot}`);
                }
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }

    };

    const getTimeAgo = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    const notificationPopover = (
        <Popover id="notification-popover">
            <Popover.Body>
                {notifications.length > 0 ? (
                    <ListGroup variant="flush">
                        {notifications.slice(0, 3).map((notif) => (
                            <ListGroup.Item
                                key={notif._id}
                                className={`d-flex justify-content-between align-items-center ${notif.isRead ? "" : "fw-bold bg-light"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleMarkAsRead(notif._id)}
                            >
                                <div style={{ width: "80%" }}>
                                    <strong>{notif.title}</strong>
                                    <p className="mb-0 small">{notif.message}</p>
                                    <small className="text-muted">{getTimeAgo(notif.createdAt)}</small>
                                </div>
                                {!notif.isRead && <span className="badge bg-primary">New</span>}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p className="text-center text-muted mb-0">No new notifications</p>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={notificationPopover} rootClose>
            <Button variant="light" size="sm" className="position-relative">
                <IoNotificationsSharp size={20} />
                {notifications.some((n) => !n.isRead) && (
                    <span className="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-danger">
                        {notifications.filter((n) => !n.isRead).length}
                    </span>
                )}
            </Button>
        </OverlayTrigger>
    );
};

export default NotificationButton;
