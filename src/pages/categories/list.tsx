import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import { 
    DataGrid, 
    GridColDef, 
    GridCellParams, 
    ValueFormatterParams, 
    GridToolbar,
    GridSortDirection 
} from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'
import Moment from 'moment'

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

const CategoriesList: React.FC<CategoriesProps> = (props : CategoriesProps) => {

    const { categories } = props;

    const router = useRouter()

    // Link da documentacao da tabela: https://material-ui.com/pt/components/data-grid/

    // definicao das colunas da tabela
    const columns: GridColDef[] = [
        { 
            field: 'name', 
            headerName: 'Nome', 
            flex: 1,
        },
        { 
            field: 'created_at', 
            headerName: 'Criado em', 
            flex: 0.3,
            valueFormatter: (params: ValueFormatterParams) => 
                (Moment(String(params.value)).format("DD/MM/YYYY HH:mm:ss"))
             
        },
        { 
            field: 'actions', 
            headerName: 'Ações',
            sortable: false,
            filterable: false,
            flex: 0.3,
            renderCell: (params: GridCellParams) => (
                <>
                    <Button 
                        type="button"
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }} 
                        onClick={() => router.push({
                            pathname: "/categories/edit",
                            query: { uuid: params.getValue('uuid') }
                        })}>
                        Editar
                    </Button>
                    <Button 
                        type="button"
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: 16 }} 
                        onClick={() => handleDelete(params.getValue('uuid'))}>
                        Excluir
                    </Button>
                </>
            ),
        },
      ];

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
                <div style={{ width: '100%', height: 800, margin: 0, padding: 9 }}>
                    <DataGrid 
                            columns={columns} 
                            pageSize={25} 
                            rowsPerPageOptions={[10, 20, 25, 50, 100]} 
                            rows={categories}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            sortModel={[
                                {
                                field: 'name',
                                sort: 'asc' as GridSortDirection,
                                },
                            ]} 
                        />
                </div>
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