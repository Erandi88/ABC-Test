import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Dropdown, Header, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const targetUrl = 'https://onbordingtaskdemo.azurewebsites.net/api/Sale';

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);



    const [newSaleData, setNewSaleData] = useState({
        customerId: '',
        productId: '',
        storeId: '',
        dateSold: '',
    });

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    const [editSaleId, setEditSaleId] = useState(null);
    const [editSaleData, setEditSaleData] = useState({
        customerId: '',
        productId: '',
        storeId: '',
        dateSold: '',
    });

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);

    const handleDelete = (saleId) => {
        setSaleToDelete(saleId);
        setConfirmDelete(true);
    };

    const confirmDeleteSale = async () => {
        try {
            const response = await fetch(`${targetUrl}/${saleToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Sale deleted successfully
                const updatedSales = sales.filter((sale) => sale.id !== saleToDelete);
                setSales(updatedSales);
            } else {
                console.error('Error deleting sale');
            }
        } catch (error) {
            console.error('Error deleting sale:', error);
        }

        setSaleToDelete(null);
        setConfirmDelete(false);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesResponse = await fetch(targetUrl);
                const salesData = await salesResponse.json();
                setSales(salesData);

                // Fetch data for dropdowns (customers, products, stores)

                const customersResponse = await fetch(`https://onbordingtaskdemo.azurewebsites.net/api/Customer?page=${currentPage}&pageSize=10`);
                const customersData = await customersResponse.json();
                setCustomers(customersData.customers);
                setTotalPages(customersData.totalPages);

                const productsResponse = await fetch(`https://onbordingtaskdemo.azurewebsites.net/api/Product?page=${currentPage}&pageSize=10`);
                const productsData = await productsResponse.json();
                setProducts(productsData.products);
                setTotalPages(productsData.totalPages);

                const storesResponse = await fetch(`https://onbordingtaskdemo.azurewebsites.net/api/Store?page=${currentPage}&pageSize=10`);
                const storesData = await storesResponse.json();
                setStores(storesData.stores);
                setTotalPages(storesData.totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleEdit = (saleId) => {
        setEditSaleId(saleId);
        const saleToEdit = sales.find((sale) => sale.id === saleId);
        if (saleToEdit) {
            setEditSaleData({
                customerId: saleToEdit.customerId,
                productId: saleToEdit.productId,
                storeId: saleToEdit.storeId,
                dateSold: saleToEdit.dateSold,
            });
        }
        setEditModalOpen(true);
    };

    const handleEditSale = async () => {

        if (editSaleId) {
            try {
                const response = await fetch(`${targetUrl}/${editSaleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editSaleData),
                });

                if (response.ok) {
                    const updatedSales = sales.map((sale) => {
                        if (sale.id === editSaleId) {
                            return {
                                ...sale,
                                customerId: editSaleData.customerId,
                                productId: editSaleData.productId,
                                storeId: editSaleData.storeId,
                                dateSold: editSaleData.dateSold,
                            };
                        }
                        return sale;
                    });
                    setSales(updatedSales);
                } else {
                    console.error('Error updating sale');
                }
            } catch (error) {
                console.error('Error updating sale:', error);
            }
        }

        setEditSaleId(null);
        setEditModalOpen(false);
        setEditSaleData({
            customerId: '',
            productId: '',
            storeId: '',
            dateSold: '',
        });
    };

    const handleNewSale = () => {
        setCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        setNewSaleData({
            customerId: '',
            productId: '',
            storeId: '',
            dateSold: '',
        });
    };

    const handleSaveNewSale = async () => {
        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSaleData),
            });

            if (response.ok) {
                const updatedResponse = await fetch(targetUrl);
                const updatedData = await updatedResponse.json();
                setSales(updatedData);

                handleCloseCreateModal();
            } else {
                console.error('Error saving new sale');
            }
        } catch (error) {
            console.error('Error saving new sale:', error);
        }
    };

    const handleInputChange = (e, { name, value }) => {
        setNewSaleData((prevData) => ({
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
            <Button primary onClick={handleNewSale}>
                New Sale
            </Button>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Store</Table.HeaderCell>
                        <Table.HeaderCell>Date Sold</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {sales.map((sale) => (
                        <Table.Row key={sale.id}>
                            <Table.Cell>{sale.customer.name}</Table.Cell>
                            <Table.Cell>{sale.product.name}</Table.Cell>
                            <Table.Cell>{sale.store.name}</Table.Cell>
                            <Table.Cell>{sale.dateSold}</Table.Cell>
                            <Table.Cell>
                                <Button icon="edit" color="yellow" onClick={() => handleEdit(sale.id)}>
                                    <i className="edit icon"></i>
                                    <span style={{ marginRight: '5px' }}>Edit</span>
                                </Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button icon="delete" color="red" onClick={() => handleDelete(sale.id)}>
                                    <i className="delete icon"></i>
                                    <span style={{ marginRight: '5px' }}>Delete</span>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {renderPagination()}

            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Modal.Header>Edit Sale</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Customer</label>
                            <Dropdown
                                name="customerId"
                                value={editSaleData.customerId}
                                options={customers.map((customer) => ({
                                    key: customer.id,
                                    text: customer.name,
                                    value: customer.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'customerId', value })
                                }
                                selection
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Product</label>
                            <Dropdown
                                name="productId"
                                value={editSaleData.productId}
                                options={products.map((product) => ({
                                    key: product.id,
                                    text: product.name,
                                    value: product.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'productId', value })
                                }
                                selection
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Store</label>
                            <Dropdown
                                name="storeId"
                                value={editSaleData.storeId}
                                options={stores.map((store) => ({
                                    key: store.id,
                                    text: store.name,
                                    value: store.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'storeId', value })
                                }
                                selection
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Date Sold</label>
                            <Input
                                name="dateSold"
                                type="date"
                                value={editSaleData.dateSold}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleEditSale}>
                        Save
                    </Button>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={createModalOpen} onClose={handleCloseCreateModal}>
                <Modal.Header>Create New Sale</Modal.Header>
                <Modal.Content>

                    <Form>
                        <Form.Field>
                            <label>Customer</label>
                            <Dropdown

                                name="customerId"
                                value={newSaleData.customerId}
                                options={customers.map((customer) => ({

                                    key: customer.id,
                                    text: customer.name,
                                    value: customer.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'customerId', value })
                                }
                                selection
                            />


                        </Form.Field>
                        <Form.Field>
                            <label>Product</label>
                            <Dropdown
                                name="productId"
                                value={newSaleData.productId}
                                options={products.map((product) => ({
                                    key: product.id,
                                    text: product.name,
                                    value: product.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'productId', value })
                                }
                                selection
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Store</label>
                            <Dropdown
                                name="storeId"
                                value={newSaleData.storeId}
                                options={stores.map((store) => ({
                                    key: store.id,
                                    text: store.name,
                                    value: store.id,
                                }))}
                                onChange={(e, { value }) =>
                                    handleInputChange(e, { name: 'storeId', value })
                                }
                                selection
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Date Sold</label>
                            <Input
                                name="dateSold"
                                type="date"
                                value={newSaleData.dateSold}
                                onChange={(e, { value }) =>
                                    setNewSaleData({ ...newSaleData, dateSold: value })
                                }
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={handleSaveNewSale}>
                        Save
                    </Button>
                    <Button onClick={handleCloseCreateModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>

            <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this sale?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={confirmDeleteSale}>
                        <Icon name='remove' /> Delete
                    </Button>
                    <Button color='green' inverted onClick={() => setConfirmDelete(false)}>
                        <Icon name='checkmark' /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default SalesList;
