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

    const [errors, setErrors ] = useState({})

    const [createUser] = useMutation(CREATE_USER,{
        errorPolicy: 'all'// Otherwise error will be mapped to network error
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        try {
            //console.log('Form Data:', formData);
            const res = await createUser({ variables: { input: formData } });
            //console.log('Response:', res);
            const backendError = res.error?.errors?.[0] || res.errors?.[0] || res?.graphQLErrors?.[0];
            
            if(backendError) {
                const backendErrors = {};
                const detailsErrors = backendError.details || backendError?.extensions?.details || [];
                //console.log('Details:', detailsErrors);
                if(detailsErrors.length > 0) {                    
                    detailsErrors.forEach(detailErr => {                        
                        backendErrors[detailErr.field] = detailErr.error;
                    })
                }
                else {                    
                    backendErrors.general = backendError.message;
                }
                setErrors(backendErrors);
                console.log('Errors:', backendErrors);
                return;
            }

            refetch();
            handleClose();
        } catch (error) {            
            setErrors({ general: "Something went wrong. Please try again" });
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
                    {errors.general && <div className="alert alert-danger">{errors.general}</div>}
                    <Form onSubmit={handleSubmit}>                
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter name" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter password" 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
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
