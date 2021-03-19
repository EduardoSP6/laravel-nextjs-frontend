import { GetServerSideProps, GetStaticProps } from 'next'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTable, usePagination } from "react-table"
import Moment from "moment"

type Category = {
    id: number,
    uuid: string,
    name: string,
    created_at: Date,
    updated_at: Date,
}

type CategoriesProps = {
    categories: Category[]
}

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
      background: white;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const CategoriesList: React.FC<CategoriesProps> = (props : CategoriesProps) => {

    const { categories } = props;

    const router = useRouter()

    // Link da documentacao da react table: https://react-table.tanstack.com/docs/overview

    // colunas da tabela
    const cols = [
        {
            Header: 'Nome',
            accessor: 'name',
            filterable: true
        },
        {
            Header: 'Criado em',
            accessor: 'created_at',
            filterable: true,
            Cell: row => (
                <span>{Moment(row.value).format("DD/MM/YYYY HH:mm:ss")}</span>
            )
        },
        {
            Header: 'Ações',
            accessor: 'uuid',
            sortable: false,
            Cell: row => (
                <div>
                    <button 
                        type="button" 
                        onClick={() => router.push({
                            pathname: "/categories/edit",
                            query: { uuid: row.value }
                        })}>
                        Editar
                    </button>
                    <button 
                        type="button" 
                        onClick={() => handleDelete(row.value)}>
                        Excluir
                    </button>
                </div>
            )
        }
    ]

    // here using the useMemo hook ensures that the data isnt recreated on every render
    const columns = useMemo(() => cols, [])
    const data = useMemo(() => categories, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        gotoPage,
        pageCount,
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex : 0}
        },
        usePagination
    )

    const { pageIndex } = state


    // excluir registro
    async function handleDelete(uuid: String) {

        if (!confirm("Deseja realmente excluir este registro?")) {
            return;
        }

        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        // headers.append("Authorization", "Bearer")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${uuid}`, {
            method: 'DELETE',
            headers: headers,
        })

        if (res.status !== 200) {
            alert("Erro ao excluir registro!")
        } else {
            router.replace(router.asPath)
            alert("Registro excluído com sucesso!")
        }
    }

    return (
        <div>
            <h1>Categorias</h1>
            <br />
            <button type="button" onClick={() => router.push("/categories/create")}>Novo</button>
            <br />
            <br />
            {categories ? (
                <Styles>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div>
                        <span>
                            {'Page '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{' '}
                        </span>
                        <span>
                            | Go to page: {' '}
                            <input 
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={(e) => {
                                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                    gotoPage(pageNumber)
                                }}
                                style={{width: '50px'}}
                                 />
                        </span>
                        <button 
                            onClick={() => gotoPage(0)} 
                            disabled={!canPreviousPage}>
                                {'<<'}
                        </button>
                        <button 
                            disabled={!canPreviousPage}
                            onClick={() => previousPage()}>
                            Previous
                        </button>
                        <button 
                            disabled={!canNextPage}
                            onClick={() => nextPage()}>
                            Next
                        </button>
                        <button 
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}>
                            {'>>'}
                        </button>
                    </div>
                </Styles>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export const getServerSideProps : GetServerSideProps = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
    const data = await res.json()
      
    return { props: { 
            categories: data 
        } 
    }
}

// SSG
// export const getStaticProps : GetStaticProps = async () => {
//     const res = await fetch(`${process.env.API_URL}/api/categories`)
//     const data = await res.json()
      
//     return { props: { 
//             categories: data 
//         },
//         revalidate: 10, 
//     }
// }

export default CategoriesList