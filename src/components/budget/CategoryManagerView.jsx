import { Button } from '../ui/button'
import ErrorAlert from '../ui/error-alert'
import CategoryManager from '../CategoryManager'

/**
 * CategoryManagerView - Tela de gerenciamento de categorias
 * 
 * Props:
 * - categories: array
 *     Array of category objects with id and name
 *     
 * - categoryError: string | null
 *     Error message to display (null if no error)
 *     
 * - onBack: function
 *     Callback to navigate back to budget list (tela = 'lista')
 *     
 * - onAddCategory: function
 *     Callback to navigate to category form for creation (tela = 'formularioCategoria')
 *     
 * - onEditCategory: function(category)
 *     Callback when user clicks edit on a category
 *     Must navigate to category form (tela = 'formularioCategoria')
 *     
 * - onDeleteCategory: function(category)
 *     Callback when user clicks delete on a category
 *     Expected to validate if category is in use before removing
 *     
 * - onClearError: function
 *     Callback to clear the category error message
 */

function CategoryManagerView({
    categories,
    categoryError,
    onBack,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
    onClearError
}) {
    return (
        <div>
            <ErrorAlert message={categoryError} onClose={onClearError} />

            <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="default" onClick={onAddCategory}>
                    Adicionar Categoria
                </Button>

                <Button variant="secondary" onClick={onBack}>
                    Voltar
                </Button>
            </div>

            <CategoryManager
                categories={categories}
                onEdit={onEditCategory}
                onRemove={onDeleteCategory}
                onAddNew={onAddCategory}
            />
        </div>
    )
}

export default CategoryManagerView
