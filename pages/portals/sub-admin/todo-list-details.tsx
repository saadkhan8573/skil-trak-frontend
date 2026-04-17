import { NextPageWithLayout, PermissionType } from '@types'
import { ReactElement } from 'react'

// layouts
import { SubAdminLayout } from '@layouts'
import { TodoTabs } from '@partials/common/todoList'
import { withPermission } from '@components'
// import { TodoTabs } from '@partials/common'

const TodoListDetails: NextPageWithLayout = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <TodoTabs />
        </div>
    )
}

TodoListDetails.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{
                title: 'Todo List Details',
                navigateBack: true,
                backTitle: 'Back',
            }}
        >
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(TodoListDetails, {
    permissions: [PermissionType.TODO_LIST],
})
