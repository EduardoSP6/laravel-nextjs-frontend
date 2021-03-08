import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import { useRouter } from 'next/router'

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

    return (
        <div>
            <h1>Categorias</h1>
            <br />
            <button type="button" onClick={() => router.push("/categories/create")}>Novo</button>
            <br />
            <br />
            {categories ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Criado em</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.uuid}>
                                <td>{category.name}</td>
                                <td>{category.created_at}</td>
                            </tr>  
                        ))}
                    </tbody>
                </table>
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