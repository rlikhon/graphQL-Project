import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CREATE_USER } from '../graphql/mutations';

const UserModal = ({ show, handleClose, refetch }) => {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '' 
    });

    const [createUser] = useMutation(CREATE_USER);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Form Data:', formData);
            await createUser({ variables: { input: formData } });
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
                <Modal.Title>New User Form</Modal.Title>
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
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
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

export default UserModal
