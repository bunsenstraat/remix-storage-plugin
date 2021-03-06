import React from "react";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Utils } from "../App";
interface ConnectionWarningProps {
  canLoad: boolean;
}

export const ConnectionWarning: React.FC<ConnectionWarningProps> = (props) => {
  //Utils.log("WARNING",props)
  return (
    <>
      <Modal show={!props.canLoad} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          <Modal.Title>
        <FontAwesomeIcon icon={faExclamationTriangle} /> Change your browser settings
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          This app won't work properly when you are not on https and your
          browser blocks third party cookies.<br></br>
          Running it in incognito mode might not work unless you allow third part cookies.<br></br>
        </Modal.Body>
      </Modal>
    </>
  );
};
