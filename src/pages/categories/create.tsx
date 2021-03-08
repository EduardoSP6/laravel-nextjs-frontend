import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

import FormErrors from '../../helpers/FormErrors'

const CategoriesCreate: React.FC = () => {
    
    const router = useRouter()

    const [name, setName] = useState("")
    const [formErrors, setFormErrors] = useState<FormErrors>(new FormErrors()) 

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

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData)
        })
 

        if (res.status == 201) {
            alert('Categoria cadastrada com sucesso')
            router.push('/categories/list')
        } else {
            console.log('Falha ao cadastrar categoria.')
            alert("Falha ao cadastrar categoria.")

            if (res.status === 422) {
                const resData = await res.json()
                const frmError = new FormErrors()
                frmError.setErrors(resData)
                setFormErrors(frmError)
            }
        }
    }

    return (
        <main>
            <h2>Criar categoria</h2>
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

export default CategoriesCreate