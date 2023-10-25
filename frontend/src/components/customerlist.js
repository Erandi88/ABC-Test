import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';



const targetUrl = 'https://onbordingtaskdemo.azurewebsites.net/api/Customer';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({ name: '', address: '' });

    // New state variables for editing
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [deletionConfirmation, setDeletionConfirmation] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const data = await response.json();
                setCustomers(data.customers);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleDelete = (customerId) => {
        setCustomerToDelete(customerId);
        setDeletionConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            const confirmResponse = await fetch(`${targetUrl}/${customerToDelete}`, {
                method: 'GET',
            });

            if (confirmResponse.ok) {
                const response = await fetch(`${targetUrl}/${customerToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                    const updatedData = await updatedResponse.json();
                    setCustomers(updatedData.customers);
                    setTotalPages(updatedData.totalPages);
                    setDeletionConfirmation(false);
                } else {
                    console.error('Error deleting customer');
                }
            } else {
                console.log('Deletion not confirmed.');
                setDeletionConfirmation(false);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleNewCustomer = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewCustomerData({ name: '', address: '' });
    };

    const handleSaveNewCustomer = async () => {
        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomerData),
            });

            if (response.ok) {
                const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const updatedData = await updatedResponse.json();
                setCustomers(updatedData.customers);
                setTotalPages(updatedData.totalPages);
                handleCloseModal();
            } else {
                console.error('Error saving new customer');
            }
        } catch (error) {
            console.error('Error saving new customer:', error);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingCustomer(null);
    };

    const handleSaveEditCustomer = async () => {

        try {
            console.log(editingCustomer.id);
            const response = await fetch(`${targetUrl}/${editingCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingCustomer),

            });

            if (response.ok) {
                const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const updatedData = await updatedResponse.json();
                setCustomers(updatedData.customers);
                setTotalPages(updatedData.totalPages);
                handleCloseEditModal();
            } else {
                console.error('Error editing customer');
            }
        } catch (error) {
            console.error('Error editing customer:', error);
        }
    };

    const handleInputChange = (e, { name, value }) => {
        setNewCustomerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditInputChange = (e, { name, value }) => {
        setEditingCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const renderPagination = () => {
        const pages = [];
        for (let page = 1; page <= totalPages; page++) {
            pages.push(
                <Button
                    key={page}
                    primary={currentPage === page}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Button>
            );
        }

        return <div className="pagination">{pages}</div>;
    };

    return (
        <div>
            <Button primary onClick={handleNewCustomer}>
                New Customer
            </Button>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {customers.map((customer) => (
                        <Table.Row key={customer.id}>
                            <Table.Cell>{customer.name}</Table.Cell>
                            <Table.Cell>{customer.address}</Table.Cell>
                            <Table.Cell>
                                <Button color="yellow" onClick={() => handleEdit(customer)}>
                                    <i className="edit icon"></i>
                                    <span style={{ marginRight: '5px' }}>Edit</span>
                                </Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button color="red" onClick={() => handleDelete(customer.id)}>
                                    <i className="delete icon"></i>
                                    <span style={{ marginRight: '5px' }}>Delete</span>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            {renderPagination()}

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Modal.Header>Create New Customer</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={newCustomerData.name}
                                onChange={handleInputChange}
                                placeholder="Enter name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Input
                                name="address"
                                value={newCustomerData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveNewCustomer}>
                        Save
                    </Button>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={editModalOpen} onClose={handleCloseEditModal}>
                <Modal.Header>Edit Customer</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={editingCustomer ? editingCustomer.name : ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Input
                                name="address"
                                value={editingCustomer ? editingCustomer.address : ''}
                                onChange={handleEditInputChange}
                                placeholder="Enter address"
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveEditCustomer}>
                        Save
                    </Button>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={deletionConfirmation} onClose={() => setDeletionConfirmation(false)}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this customer?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => setDeletionConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button positive onClick={confirmDelete}>
                        Confirm
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default CustomerList;
