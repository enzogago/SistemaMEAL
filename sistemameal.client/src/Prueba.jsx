import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTable, useGroupBy, useExpanded, useRowSelect } from "react-table";
import { fetchData } from "./components/reusable/helper";

const datos = [
    {"nombre": "Carmen", "apellido": "Gomez", "pais": "Ecuador", "meta":"100"},
    {"nombre": "Carlos", "apellido": "Morales", "pais": "Peru", "meta":"200"},
    {"nombre": "Gabriela", "apellido": "Gonzalez", "pais": "Colombia", "meta":"300"},
    {"nombre": "Ana", "apellido": "Rodriguez", "pais": "Ecuador", "meta":"400"},
    {"nombre": "Luis", "apellido": "Martinez", "pais": "Peru", "meta":"500"},
    {"nombre": "Jose", "apellido": "Fernandez", "pais": "Colombia", "meta":"600"},
    {"nombre": "Patricia", "apellido": "Garcia", "pais": "Ecuador", "meta":"700"},
    {"nombre": "Miguel", "apellido": "Morales", "pais": "Peru", "meta":"800"},
    {"nombre": "Maria", "apellido": "Martinez", "pais": "Colombia", "meta":"900"},
    {"nombre": "Miguel", "apellido": "Garcia", "pais": "Peru", "meta":"1000"}
];

const Styles = styled.div`
    padding: 1rem;

    table {
        border-spacing: 0;
        border: 1px solid black;

        tr {
        :last-child {
            td {
            border-bottom: 0;
            }
        }
        }

        th,
        td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

        :last-child {
            border-right: 0;
        }
        }
    }

    .pagination {
        padding: 0.5rem;
    }
    `;

    const IndentedSpan = styled.span`
    margin-left: ${({ depth = 0 }) => `calc(${depth || 0.25} * 2rem)`};
 `;

const Table = ({ columns, data }) => {
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows
    } = useTable(
        {
        columns,
        data
        },
        useGroupBy,
        useExpanded,
        useRowSelect,
        // hooks => {
        // hooks.visibleColumns.push(columns => {
        //     return [
        //     {
        //         id: "selection",
        //         groupByBoundary: true,
        //         Header: ({ getToggleAllRowsSelectedProps }) => (
        //         <div>
        //             <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        //         </div>
        //         ),
        //         Cell: ({ row }) => (
        //         <div>
        //             <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //         </div>
        //         )
        //     },
        //     ...columns
        //     ];
        // });
        // }
    );

    return (
        <table {...getTableProps()}>
        <thead>
            {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                    <div>
                    {column.canGroupBy ? (
                        // Grouped columns, add a toggle
                        <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🛑 " : "👊 "}
                        {column.render("Header")}
                        </span>
                    ) : (
                        column.render("Header")
                    )}
                    </div>
                </th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map(row => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                    const aggregatedCellInGroupedRow =
                    row.isGrouped &&
                    cell.isAggregated &&
                    !cell.column.groupByBoundary;
                    return aggregatedCellInGroupedRow ? null : (
                    <td {...cell.getCellProps()} colSpan={cell.isGrouped ? 6 : 1}>
                        {cell.isGrouped ? (
                        <>
                            <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                            </span>{" "}
                            {cell.render("Cell")} ({row.subRows.length})
                        </>
                        ) : cell.isPlaceholder ? null : (
                        cell.render("Cell", { editable: true })
                        )}
                    </td>
                    );
                })}
                </tr>
            );
            })}
        </tbody>
        </table>
    );
    }

    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = React.useRef();
            const resolvedRef = ref || defaultRef;

            React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
            }, [resolvedRef, indeterminate]);

            return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
            );
        }
    );

    const CellWithNestedRows = ({
        value,
        row: { canExpand, isExpanded, getToggleRowExpandedProps, depth }
        }) => {
            console.log(value)
            const shortText = value && (value.length > 30 ? value.substring(0, 30) + '...' : value);
            return (
                <>
                {canExpand ? (
                    <span {...getToggleRowExpandedProps()}>{isExpanded ? "➖" : "➕"}</span>
                ) : null}
                <IndentedSpan depth={depth}>{shortText}</IndentedSpan>
                </>
            );
    };

    const Prueba = () => {
        const [metas, setMetas] = useState([])
        useEffect(() => {
            fetchData('Monitoreo/Filter', setMetas)
        }, []);

        const columns = React.useMemo(
        () => [
            {
                Header: "Indicador",
                accessor: "indActResCod",
                canGroupBy: true,
                Cell: CellWithNestedRows,
            },
            {
                Header: "Estado",
                accessor: "estNom",
                canGroupBy: false
            },  
            {
                Header: "Nombre",
                accessor: "nombre",
                canGroupBy: false,
            },
            {
                Header: "Meta Programatica",
                accessor: "metMetTec",
                canGroupBy: false,
                Cell: ({ row }) => {
                    console.log(row)
                  // Si la fila puede expandirse, entonces es una fila de grupo y calculamos la suma de 'meta'
                  // De lo contrario, es una fila individual y mostramos el valor individual
                  if (row.canExpand) {
                    const total = row.original.subRows.reduce((sum, record) => sum + parseFloat(record.metMetTec), 0);
                    return `${total} (total)`;
                  } else {
                    return row.values.metMetTec;
                  }
                },
              },
        ],[]
    );

    // Agrupamos los datos por 'indActResAno' y 'indActResCod'
    const groupedData = metas.reduce((allGroups, item) => {
        const key = item.indActResAno + '-' + item.indActResCod;
        if (!allGroups[key]) {
            allGroups[key] = [];
        }
        allGroups[key].push(item);
        return allGroups;
    }, {});

    // Convertimos los datos agrupados en un formato que react-table puede entender
    const expandedData = Object.keys(groupedData).map(key => ({
        indActResCod: key,
        subRows: groupedData[key],
    }));


    return (
        <div className="PowerMas_TableStatus">
            <Table columns={columns} data={expandedData} />
        </div>
    );
}

export default Prueba;
