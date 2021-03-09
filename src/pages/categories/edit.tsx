import React, { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import FormError from '../../helpers/FormError'


type Category = {
    id: number,
    uuid: string,
    name: string,
    created_at: Date,
    updated_at: Date,
}

type CategoryParams = {
    uuid: string
}

const CategoriesEdit: React.FC = () => {
    
    const router = useRouter()

    const [name, setName] = useState("")
    const [formErrors, setFormErrors] = useState<FormError>(new FormError()) 

    const { uuid } = router.query


    // obtem o registro da categoria
    useEffect(() => {
        async function findCategory() {
            try {
                const headers = new Headers()
                headers.append("Accept", "application/json")
                headers.append("Content-Type", "application/json")
                // headers.append("Authorization", "Bearer")
        
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${uuid}/edit`, {
                    method: 'GET',
                    headers: headers,
                })
    
                if (res.status === 200) {
                    const categ = await res.json()

                    console.log(categ)

                    // preenche os campos do form
                    setName(categ.name)

                } else {
                    alert("Categoria não encontrada!")
                    router.back()                   
                }
    
            } catch(error) {
                alert("Ocorreu um erro ao obter a categoria")
                console.error("Erro ao obter categoria: "+ error)
                router.back()                   
            }
        }

        findCategory()
    }, [])


    // submit do form
    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        formErrors.reset()

        // corpo da requisicao
        const formData = {
            'name': name
        }
        
        // request

        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        // headers.append("Authorization", "Bearer")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${uuid}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(formData)
        })

        if (res.status == 200) {
            alert('Registro atualizado com sucesso!')
            router.push('/categories/list')
        } else {
            console.log('Falha ao atualizar registro.')
            alert("Falha ao atualizar registro!")

            if (res.status === 422) {
                const resData = await res.json()
                const frmError = new FormError()
                frmError.setErrors(resData)
                setFormErrors(frmError)
            }
        }
    }

    return (
        <main>
            <h2>Editar categoria</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-block">
                    <label htmlFor="name">Nome*</label>
                    <input id="name" value={name} onChange={e => setName(e.target.value)} />
                    <span>{formErrors ? formErrors.getKey('name') : ''}</span>
                </div>

                <button type="submit">Confirmar</button>
            </form>
        </main>
    )
}

export default CategoriesEdit