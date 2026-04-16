import { motion } from 'framer-motion'
import {
    Image as ImageIcon,
    FileText,
    Upload,
    Grid3x3,
    List,
} from 'lucide-react'
import { MediaType, ViewMode } from './types'
import { Permissions } from '@components'
import { PermissionType } from '@types'

interface GalleryControlsProps {
    selectedType: MediaType
    viewMode: ViewMode
    isUploading: boolean
    onTypeChange: (type: MediaType) => void
    onViewModeChange: (mode: ViewMode) => void
    onUpload: () => void
}

export function GalleryControls({
    selectedType,
    viewMode,
    isUploading,
    onTypeChange,
    onViewModeChange,
    onUpload,
}: GalleryControlsProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            {/* Type Filter */}
            <div className="flex gap-1.5">
                <button
                    onClick={() => onTypeChange('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedType === 'all'
                            ? 'bg-gradient-to-br from-[#044866] to-[#0D5468] text-white shadow-md'
                            : 'bg-[#F8FAFB] text-[#64748B] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                    }`}
                >
                    All Media
                </button>
                <button
                    onClick={() => onTypeChange('photo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        selectedType === 'photo'
                            ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-md'
                            : 'bg-[#F8FAFB] text-[#64748B] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                    }`}
                >
                    <ImageIcon className="w-3 h-3" />
                    Photos
                </button>
                <button
                    onClick={() => onTypeChange('pdf')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        selectedType === 'pdf'
                            ? 'bg-gradient-to-br from-[#F7A619] to-[#EA580C] text-white shadow-md'
                            : 'bg-[#F8FAFB] text-[#64748B] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                    }`}
                >
                    <FileText className="w-3 h-3" />
                    PDFs
                </button>
            </div>

            {/* View Mode & Upload */}
            <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 p-0.5 bg-[#F8FAFB] rounded-lg border border-[#E2E8F0]">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-1.5 rounded-md transition-all ${
                            viewMode === 'grid'
                                ? 'bg-white shadow-sm text-[#044866]'
                                : 'text-[#64748B]'
                        }`}
                    >
                        <Grid3x3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-1.5 rounded-md transition-all ${
                            viewMode === 'list'
                                ? 'bg-white shadow-sm text-[#044866]'
                                : 'text-[#64748B]'
                        }`}
                    >
                        <List className="w-3.5 h-3.5" />
                    </button>
                </div>

                <Permissions
                    permission={[PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS]}
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onUpload}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-lg text-xs font-medium hover:shadow-md transition-all disabled:opacity-50"
                    >
                        <Upload className="w-3 h-3" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </motion.button>
                </Permissions>
            </div>
        </div>
    )
}
