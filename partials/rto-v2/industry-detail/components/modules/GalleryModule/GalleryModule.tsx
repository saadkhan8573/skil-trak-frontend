import { useState } from 'react'
import {
    GalleryControls,
    GalleryGridView,
    GalleryListView,
    GalleryStats,
    MediaType,
    ViewMode,
} from './components'
import { IndustryApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { DocumentsView } from '@hooks'
import { NoData } from '@components'
import { AddGalleryModal, DeleteGalleryModal } from './modal'
import { IndustryGalleryItem } from '@types'
import { GalleryTabSkeleton } from '../../../skeletonLoader'

export function GalleryModule() {
    const [selectedType, setSelectedType] = useState<MediaType>('all')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean
        id: number | null
    }>({ open: false, id: null })
    const { onFileClicked, documentsViewModal } = DocumentsView()

    const industry = useAppSelector((state) => state.industry.industryDetail)

    // API Queries
    const { data: galleryData, isLoading } =
        IndustryApi.Gallery.industryGallery(
            {
                userId: industry?.user?.id,
            },
            { skip: !industry?.user?.id }
        )

    const getMediaType = (fileUrl: string): 'photo' | 'pdf' => {
        if (!fileUrl) return 'photo'
        const extension = fileUrl.split('.').pop()?.toLowerCase()
        return extension === 'pdf' ? 'pdf' : 'photo'
    }

    const filteredMedia: IndustryGalleryItem[] =
        galleryData?.filter((item: IndustryGalleryItem) => {
            if (selectedType === 'all') return true
            return getMediaType(item.file) === selectedType
        }) || []

    const handleDelete = (id: number) => {
        setDeleteModal({ open: true, id })
    }

    const handlePreview = (item: IndustryGalleryItem) => {
        const extension = item.file.split('.').pop()
        onFileClicked({ file: item.file, extension })
    }

    if (isLoading) {
        return <GalleryTabSkeleton />
    }

    return (
        <div className="space-y-4 px-4">
            {documentsViewModal}
            <GalleryStats industryUserId={industry?.user?.id!} />

            <GalleryControls
                selectedType={selectedType}
                viewMode={viewMode}
                onTypeChange={setSelectedType}
                onViewModeChange={setViewMode}
                onUpload={() => setShowUploadModal(true)}
                isUploading={false}
            />

            {filteredMedia.length === 0 ? (
                <NoData text="No gallery items found" />
            ) : viewMode === 'grid' ? (
                <GalleryGridView
                    items={filteredMedia}
                    onPreview={handlePreview}
                    onDelete={handleDelete}
                />
            ) : (
                <GalleryListView
                    items={filteredMedia}
                    onPreview={handlePreview}
                    onDelete={handleDelete}
                />
            )}

            <AddGalleryModal
                open={showUploadModal}
                industryUserId={industry?.user?.id!}
                onClose={() => setShowUploadModal(false)}
                onSuccess={() => setShowUploadModal(false)}
            />

            <DeleteGalleryModal
                open={deleteModal.open}
                galleryId={deleteModal.id}
                onClose={() => setDeleteModal({ open: false, id: null })}
                onSuccess={() => setDeleteModal({ open: false, id: null })}
            />
        </div>
    )
}
