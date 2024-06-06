import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import '../styles/OptionsButtom.css';
import {
  FlagFill,
  PencilSquare,
  ThreeDotsVertical,
  Trash,
} from "react-bootstrap-icons";


const OptionsButtom = ({ target, onEdit, onDelete, onReport, userSession }) => {
  // Recuperar userData del localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(target)
  return (
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={
        <Popover id="popover-positioned-left">
          <Popover.Body>
            {userSession && (
              <p>
                <FlagFill
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport(target);
                  }}
                />{" "}
                Report
              </p>
            )}
            {userData.user === target.username && (
              <>
                <p>
                  <PencilSquare
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(target);
                    }}
                  />{" "}
                  Edit
                </p>
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
                  Delete
                </p>
              </>
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

