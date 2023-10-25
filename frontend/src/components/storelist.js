import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const targetUrl = 'https://onbordingtaskdemo.azurewebsites.net/api/Store';
const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newStoreData, setNewStoreData] = useState({ name: '', address: '' });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editStoreData, setEditStoreData] = useState({ id: null, name: '', address: '' });

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [storeIdToDelete, setStoreIdToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const data = await response.json();
                setStores(data.stores);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleEdit = (store) => {
        setEditStoreData({
            id: store.id,
            name: store.name,
            address: store.address,
        });
        setEditModalOpen(true);
    };

    const openDeleteConfirmation = (storeId) => {
        setStoreIdToDelete(storeId);
        setDeleteConfirmationOpen(true);
    };

    const confirmDelete = async () => {
        if (storeIdToDelete !== null) {
            try {
                const response = await fetch(`${targetUrl}/${storeIdToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                    const data = await response.json();
                    setStores(data.stores);
                    setTotalPages(data.totalPages);
                    
                    setDeleteConfirmationOpen(false);
                } else {
                    console.error('Error deleting store');
                }
            } catch (error) {
                console.error('Error deleting store:', error);
            }
        }
    };

    const handleNewStore = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewStoreData({ name: '', address: '' });
    };

    const handleSaveNewStore = async () => {
        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStoreData),
            });

            if (response.ok) {
                const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const data = await response.json();
                setStores(data.stores);
                setTotalPages(data.totalPages);

                handleCloseModal();
            } else {
                console.error('Error saving new store');
            }
        } catch (error) {
            console.error('Error saving new store:', error);
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`${targetUrl}/${editStoreData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editStoreData),
            });

            if (response.ok) {
                const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const data = await response.json();
                setStores(data.stores);
                setTotalPages(data.totalPages);

                setEditModalOpen(false);
            } else {
                console.error('Error saving edited store');
            }
        } catch (error) {
            console.error('Error saving edited store:', error);
        }
    };

    const handleInputChange = (e, { name, value }) => {
        setNewStoreData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditInputChange = (e, { name, value }) => {
        setEditStoreData((prevData) => ({
            ...prevData,
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
            <Button primary onClick={handleNewStore}>
                New Store
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
                    {stores.map((store) => (
                        <Table.Row key={store.id}>
                            <Table.Cell>{store.name}</Table.Cell>
                            <Table.Cell>{store.address}</Table.Cell>
                            <Table.Cell>
                                <Button icon="edit" color="yellow" onClick={() => handleEdit(store)}>
                                    <i className="edit icon"></i>
                                    <span style={{ marginRight: '5px' }}>Edit</span>
                                </Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon="delete" color="red" onClick={() => openDeleteConfirmation(store.id)}>
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
                <Modal.Header>Create New Store</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={newStoreData.name}
                                onChange={handleInputChange}
                                placeholder="Enter name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Input
                                name="address"
                                value={newStoreData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveNewStore}>
                        Save
                    </Button>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Modal.Header>Edit Store</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={editStoreData.name}
                                onChange={handleEditInputChange}
                                placeholder="Enter name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Input
                                name="address"
                                value={editStoreData.address}
                                onChange={handleEditInputChange}
                                placeholder="Enter address"
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleEditSave}>
                        Save
                    </Button>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                <Modal.Header>Confirm Delete</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this store?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={confirmDelete}>
                        Confirm
                    </Button>
                    <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default StoreList;
