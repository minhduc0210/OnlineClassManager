import React, { useContext, useState, useEffect } from "react";
import { Button, OverlayTrigger, Popover, Stack } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoAddCircleSharp, IoNotificationsSharp, IoSchoolSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchUser } from "../../services/AuthService";
import StudentModal from "../Modals/StudentModal";
import TeacherModal from "../Modals/TeacherModal";
import { fetchGetNotifications } from "../../services/NotificationService";

const ProfileButton = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const { user, logout, setClassrooms } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const popover = (
    <Popover id="logout-popover">
      <Popover.Body>
        <p className="mb-2">Are you sure you want to log out?</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            size="sm"
            className="me-2"
            onClick={() => setShowPopover(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  const notificationPopover = (
    <Popover id="notification-popover">
      <Popover.Body>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div key={index} className="border-bottom pb-2 mb-2">
              <strong>{notif.title}</strong>
              <p className="text-muted small mb-0">{notif.message}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted mb-0">No new notifications</p>
        )}
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    (async () => {
      const { data } = await fetchUser();
      setClassrooms(data.classrooms);
      const notificationRes = await fetchGetNotifications();
      setNotifications(notificationRes.data.notifications);
    })();
  }, [modalShow, setClassrooms]);

  return (
    <Stack className="ms-auto" direction="horizontal" gap={2}>
      <OverlayTrigger trigger="click" placement="bottom" overlay={notificationPopover}>
        <Button variant="light" size="sm" className="position-relative">
          <IoNotificationsSharp size={20} />
          {notifications.length > 0 && (
            <span className="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-danger">
              {notifications.length}
            </span>
          )}
        </Button>
      </OverlayTrigger>

      {user.role === "student" ? (
        <>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setModalShow(true)}
          >
            <IoAddCircleSharp className="me-2" />
            Enter the classroom
          </Button>
          <StudentModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
      ) : (
        <>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setModalShow(true)}
          >
            <IoSchoolSharp className="me-2" />
            Create Classroom
          </Button>
          <TeacherModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
      )}
      <Button
        variant="outline-secondary"
        className="ms-auto btn-outline-primary"
        size="sm"
        as={Link}
        to={"/profile"}
      >
        <BsPersonCircle className="me-2" />
        {user.name} {user.lastname}
      </Button>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        show={showPopover}
        onToggle={() => setShowPopover(!showPopover)}
        overlay={popover}
        rootClose
      >
        <Button variant="secondary" size="sm">
          <RiLogoutCircleRLine />
        </Button>
      </OverlayTrigger>
    </Stack>
  );
};

export default ProfileButton;