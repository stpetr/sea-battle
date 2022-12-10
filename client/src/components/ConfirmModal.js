import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export const ConfirmModal = ({ message, title = '', yesButtonText = 'Yes', noButtonText = 'No', onYes, onNo, show }) => {
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onNo}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onYes}>{yesButtonText}</Button>
        <Button onClick={onNo}>{noButtonText}</Button>
      </Modal.Footer>
    </Modal>
  )
}
