import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import { useFetch } from '../../helpers/useFetch'
import { mutate, trigger } from 'swr'

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

const CategoriesList: React.FC<CategoriesProps> = () => {

    const router = useRouter()

    const { data, error } = useFetch<Category[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)

    if (!data && !error) {
        return <p>Carregando...</p>
    }

    if (error) {
        return <p>Erro: {error.message}</p>
    }
    
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
                            query: { uuid: params.row.uuid }
                        })}>
                        Editar
                    </Button>
                    <Button 
                        type="button"
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: 16 }} 
                        onClick={() => handleDelete(params.row.uuid)}>
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

        const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${uuid}`
        const listUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`

        mutate(listUrl, data?.filter(e => e.uuid !== uuid), false)

        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        // headers.append("Authorization", "Bearer")

        const res = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: headers,
        })

        if (res.status !== 200) {
            alert("Erro ao excluir registro!")
        } else {
            // router.replace(router.asPath)
            alert("Registro excluído com sucesso!")
        }

        trigger(listUrl)
    }

    return (
        <div className="container">
            <Link href="/">Home</Link>
            <h1>Categorias {data?.length}</h1>
            <br />
            <button type="button" onClick={() => router.push("/categories/create")}>Novo</button>
            <br />
            <br />
            <div style={{ width: '100%', height: 800, margin: 0, padding: 9 }}>
                <DataGrid 
                        columns={columns} 
                        pageSize={25} 
                        rowsPerPageOptions={[10, 20, 25, 50, 100]} 
                        rows={data || []}
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
        </div>
    )
}

export default CategoriesList