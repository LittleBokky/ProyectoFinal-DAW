import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import '../styles/OptionsButtom.css';
import { ThreeDotsVertical, Trash } from "react-bootstrap-icons";

const OptionsButtom = ({ target, onDelete }) => {
  // Recuperar userData del localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={
        <Popover id="popover-positioned-left">
          <Popover.Body>
            {userData.user === target.username && (
              <p>
                <Trash
                  alt="Remove"
                  height={20}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(target.id);
                  }}
                />{" "}
                Borrar
              </p>
            )}
          </Popover.Body>
        </Popover>
      }
    >
      <ThreeDotsVertical alt="Options" style={{ cursor: "pointer" }} />
    </OverlayTrigger>
  );
};

export default OptionsButtom;
