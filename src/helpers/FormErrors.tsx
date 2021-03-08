class FormErrors 
{
    errors = {};

    getErrors() {
        return this.errors
    }

    setErrors(response: any) {
        this.errors = response.errors
    }

    getKey(keyName: string) {
        return (this.errors[keyName] !== undefined) ? this.errors[keyName] : null
    }

    reset() {
        this.errors = {}
    }
}

export default FormErrors;