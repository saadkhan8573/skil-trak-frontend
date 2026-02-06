import { ActionButton } from '@components'
import { useNotification } from '@hooks'
import { Course, Folder } from '@types'
import { useState } from 'react'
import { FaFolder } from 'react-icons/fa'
import { DeleteFolderCard } from './DeleteFolderCard'
import { EditAssessmentFolder } from './EditAssessmentFolder'
export const CourseFolder = ({
    folder,
    category,
    course,
    result,
}: {
    folder: Folder
    course: Course
    category: any
    result: any
}) => {

    const [edit, setEdit] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const getFolderType = () => {
        switch (folder.type) {
            case 'docs':
                return 'Documents'
            case 'images':
                return 'Images'
            case 'videos':
                return 'Videos'
        }
    }

    const onCancel = () => {
        setEdit(false)
    }

    return (
        <>
            <div className="border-b pb-4">
                {edit ? (
                    <>
                        {/* <CourseFolderForm
                            edit
                            onSubmit={onSubmit}
                            onCancel={onCancel}
                            initialValues={folder}
                        /> */}
                        <EditAssessmentFolder
                            folder={folder}
                            course={course}
                            onCancel={onCancel}
                        />
                    </>
                ) : (
                    <div className="relative">
                        {deleting && (
                            <DeleteFolderCard
                                folder={folder}
                                setDeleting={() => setDeleting(false)}
                            />
                        )}
                        <div>
                            <div className="flex justify-between">
                                <div className="flex gap-x-2 items-center">
                                    <span className="text-indigo-500">
                                        <FaFolder />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {folder.name}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {'('}
                                        {folder.capacity}
                                        {')'}
                                    </span>
                                </div>

                                <div>
                                    <ActionButton
                                        variant="info"
                                        simple
                                        onClick={() => setEdit(true)}
                                    >
                                        Edit
                                    </ActionButton>
                                    <ActionButton
                                        variant="error"
                                        simple
                                        onClick={() => setDeleting(true)}
                                    >
                                        Delete
                                    </ActionButton>
                                </div>
                            </div>

                            <p className="text-xs text-gray-600">
                                {getFolderType()}
                            </p>

                            <div className="mt-2">
                                <p className="text-[11px] text-gray-500">
                                    Description:
                                </p>
                                <p className="text-xs text-gray-700 font-medium">
                                    {folder.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
