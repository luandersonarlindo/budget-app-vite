import { useEffect, useState } from 'react'

const CATEGORIAS_PADRAO = [
    { id: 'essenciais', name: 'Gastos Essenciais', description: 'Gastos essenciais para o dia a dia', isDefault: true, defaultPercent: 50 },
    { id: 'financeiras', name: 'Prioridades Financeiras', description: 'Investimentos e poupança', isDefault: true, defaultPercent: 20 },
    { id: 'estilo', name: 'Estilo de Vida', description: 'Gastos com lazer e hobbies', isDefault: true, defaultPercent: 30 }
]

function useCategories() {
    // estado inicial do localStorage
    const [categories, setCategories] = useState(() => {
        const data = localStorage.getItem('categories')
        return data ? JSON.parse(data) : CATEGORIAS_PADRAO
    })

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories))
    }, [categories])

    // função addCategory
    function addCategory(category) {
        const newCategory = { ...category, id: Date.now().toString() }
        setCategories(prevCategories => [...prevCategories, newCategory])
    }

    // função removeCategory (só se !isDefault)
    function removeCategory(id) {
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id || category.isDefault))
    }

    function updateCategory(id, updatedCategory) {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, ...updatedCategory } : cat
        ))
    }

    return { categories, addCategory, updateCategory, removeCategory }
}

export default useCategories