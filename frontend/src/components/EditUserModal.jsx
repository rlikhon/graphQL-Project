import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UPDATE_USER } from '../graphql/mutations';

const EditUserModal = ({ show, handleClose, user, refetch }) => {
    const [ formData, setFormData ] = useState({
        name: '',
        email: ''
    });

    const [updateUser] = useMutation(UPDATE_USER);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email                        
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form Data:', formData);
            await updateUser({ 
                variables: {
                    input: formData,
                    updateUserId: user.id
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
                <Modal.Title>Edit User Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        />
                    </Form.Group>                    
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditUserModal
