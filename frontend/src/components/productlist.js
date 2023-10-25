import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Confirm} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const targetUrl = 'https://onbordingtaskdemo.azurewebsites.net/api/Product';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newProductData, setNewProductData] = useState({ name: '', price: '' });

    const [deleteProductId, setDeleteProductId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [editProductData, setEditProductData] = useState({ id: null, name: '', price: '' });
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const data = await response.json();
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleEdit = (product) => {
        setEditProductData({ id: product.id, name: product.name, price: product.price });
        setEditModalOpen(true);
    };

    const handleSaveEditProduct = async () => {
        try {
            const response = await fetch(`${targetUrl}/${editProductData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editProductData.name,
                    price: editProductData.price,
                }),
            });

            if (response.ok) {
                const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const updatedData = await updatedResponse.json();
                setProducts(updatedData.products);
                setTotalPages(updatedData.totalPages);
                
                setEditModalOpen(false);
            } else {
                console.error('Error saving edited product');
            }
        } catch (error) {
            console.error('Error saving edited product:', error);
        }
    };

    const handleDelete = (productId) => {
        setDeleteProductId(productId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${targetUrl}/${deleteProductId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const updatedData = await updatedResponse.json();
                setProducts(updatedData.products);
                setTotalPages(updatedData.totalPages);
                
            } else {
                console.error('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setConfirmOpen(false);
            setDeleteProductId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setDeleteProductId(null);
    };

    const handleNewProduct = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewProductData({ name: '', price: '' });
    };

    const handleSaveNewProduct = async () => {
        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProductData),
            });

            if (response.ok) {
                const updatedResponse = await fetch(`${targetUrl}?page=${currentPage}&pageSize=10`);
                const updatedData = await updatedResponse.json();
                setProducts(updatedData.products);
                setTotalPages(updatedData.totalPages);
               
                handleCloseModal();
            } else {
                console.error('Error saving new product');
            }
        } catch (error) {
            console.error('Error saving new product:', error);
        }
    };

    const handleInputChange = (e, { name, value }) => {
        setNewProductData((prevData) => ({
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
            <Button primary onClick={handleNewProduct}>
                New Product
            </Button>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {products.map((product) => (
                        <Table.Row key={product.id}>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>{product.price}</Table.Cell>
                            <Table.Cell>
                                <Button icon="edit" color="yellow" onClick={() => handleEdit(product)}>
                                    <i className="edit icon"></i>
                                    <span style={{ marginRight: '5px' }}>Edit</span>
                                </Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon="delete" color="red" onClick={() => handleDelete(product.id)}>
                                    <i className="delete icon"></i>
                                    <span style={{ marginRight: '5px' }}>Delete</span>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            {renderPagination()}

            {/* New Product Modal */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Modal.Header>Create New Product</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={newProductData.name}
                                onChange={handleInputChange}
                                placeholder="Enter name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Price</label>
                            <Input
                                name="price"
                                value={newProductData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveNewProduct}>
                        Save
                    </Button>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            {/* Edit Product Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Modal.Header>Edit Product</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={editProductData.name}
                                onChange={(e, { value }) => setEditProductData({ ...editProductData, name: value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Price</label>
                            <Input
                                name="price"
                                value={editProductData.price}
                                onChange={(e, { value }) => setEditProductData({ ...editProductData, price: value })}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveEditProduct}>
                        Save
                    </Button>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Confirm
                open={confirmOpen}
                content="Are you sure you want to delete this product?"
                cancelButton="Cancel"
                confirmButton="Delete"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default ProductList;
