import React, { useState } from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';

const itemsPerPage = 1; // Change this to the number of items per page
const yourData = [1,2,3,7,9,0,5]; // Replace with your data array

const PaginatedTable = () => {
    const [activePage, setActivePage] = useState(1);
    const totalPages = Math.ceil(yourData.length / itemsPerPage);

    const handlePageChange = (e, { page }) => {
        setActivePage(page);
    };

    const paginatedData = yourData.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const tableRows = paginatedData.map((item, index) => (
        <Table.Row key={index}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.description}</Table.Cell>
            {/* Add more columns for your data */}
        </Table.Row>
    ));

    return (
        <div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        {/* Add more header cells for your columns */}
                    </Table.Row>
                </Table.Header>

                <Table.Body>{tableRows}</Table.Body>
            </Table>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan="3">
                        <Menu floated="right" pagination>
                            <Menu.Item
                                as="a"
                                icon
                                onClick={handlePageChange}
                                disabled={activePage === 1}
                                page={activePage - 1}
                            >
                                <Icon name="chevron left" />
                            </Menu.Item>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Menu.Item
                                    as="a"
                                    key={index}
                                    active={index + 1 === activePage}
                                    onClick={handlePageChange}
                                    page={index + 1}
                                >
                                    {index + 1}
                                </Menu.Item>
                            ))}
                            <Menu.Item
                                as="a"
                                icon
                                onClick={handlePageChange}
                                disabled={activePage === totalPages}
                                page={activePage + 1}
                            >
                                <Icon name="chevron right" />
                            </Menu.Item>
                        </Menu>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </div>
    );
};

export default PaginatedTable;
