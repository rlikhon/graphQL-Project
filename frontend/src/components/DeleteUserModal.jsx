import React from 'react';
import { useMutation } from '@apollo/client/react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DELETE_USER } from '../graphql/mutations';

const DeleteUserModal = ({ show, handleClose, user, refetch }) => {
    const [deleteUser] = useMutation(DELETE_USER);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {            
            await deleteUser({ 
                variables: {                 
                    deleteUserId: user.id
                }
            });
            refetch();
            handleClose();
        } catch (error) {
            console.error(error);
        }

        refetch();
        handleClose();        
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <p>Are you sure you want to delete {user.name}?</p>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" variant="danger" onClick={handleSubmit}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteUserModal
