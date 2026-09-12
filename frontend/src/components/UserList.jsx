import React, { useState } from 'react'
import {Table, Button} from 'react-bootstrap';
import {useQuery, useMutation} from '@apollo/client/react'
import { GET_USERS } from '../graphql/queries'
import UserModal from './UserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

const UserList = () => {
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 3;

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: {
      page: page,
      limit: PAGE_LIMIT
    }
  });

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const handleShow = () => setShow(true);
  
  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error.message}</p>;

  const { docs, totalDocs, totalPages, currentPage } = data.getUsers;

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-4 mt-4 text-dark">User List</h2>
      <div className="d-flex container mb-4">
        <button className="btn btn-success me-2" onClick={() => refetch()}>Refresh</button>
        <Button variant="primary me-2" onClick={handleShow}>
            Launch Modal
        </Button>
      </div>
      <div className="d-flex container justify-content-center mb-4">        
        <Table striped bordered hover className="table-success">
            <thead className="table-dark">  
                <tr>
                    <th scope="col">SL.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {docs.map((user, index) => (
                    <tr key={user.id}>                        
                        <td>{(currentPage - 1) * PAGE_LIMIT + index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span>{new Date(Number(user.createdAt)).toLocaleString()}</span></td>
                        <td>
                            <button 
                              className="btn btn-primary me-2" 
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => handleDeleteClick(user)}
                            >
                              Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
      </div>
      <div className="d-flex container justify-content-center align-items-center mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-primary ms-2"
          onClick={() => setPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="d-flex container justify-content-center mb-4">
        {show && (
          <UserModal 
            show={show} 
            handleClose={() => setShow(false)} 
            refetch={refetch} 
          />
        )}

        {selectedUser && showEditModal && (
          <EditUserModal 
            show={showEditModal} 
            handleClose={handleCloseEdit} 
            user={selectedUser} 
            refetch={refetch} 
          />
        )}

        {selectedUser && showDeleteModal && (
          <DeleteUserModal 
            show={showDeleteModal} 
            handleClose={handleCloseDelete} 
            user={selectedUser} 
            refetch={refetch} 
          />
        )}
      </div>    
    </div>
  )
}

export default UserList
