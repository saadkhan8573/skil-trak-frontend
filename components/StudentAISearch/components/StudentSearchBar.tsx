import { Badge, InitialAvatar, LoadingAnimation, NoData } from '@components'
import { Command, CommandGroup, CommandItem, CommandList } from '@components/ui'
import { CommonApi, RtoApi } from '@queries'
import { Student } from '@types'
import { ellipsisText, getUserCredentials } from '@utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { NoResultsInDropdown } from './EmptySearchState'

interface StudentSearchBarProps {
    onSelectStudent: (student: Student) => void
    onSearchChange?: (query: string) => void
}

export const StudentSearchBar = ({
    onSelectStudent,
    onSearchChange,
}: StudentSearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<{
        name?: string
        rtoId?: number
    }>({})
    const [isOpen, setIsOpen] = useState(false)
    const [hasTyped, setHasTyped] = useState(false)

    const role = getUserCredentials()?.role

    const rtoDetail = RtoApi.Rto.useProfile()
    const { isLoading, isFetching, data, isError, isSuccess } =
        CommonApi.AiAssistant.searchStudent(
            {
                search: `${JSON.stringify(filter)
                    .replaceAll('{', '')
                    .replaceAll('}', '')
                    .replaceAll('"', '')
                    .trim()}`,
                skip: 0,
                limit: 15,
            },
            {
                skip: !searchQuery,
            }
        )

    const handleSelectStudent = (student: Student) => {
        onSelectStudent(student)
        setSearchQuery('')
        setIsOpen(false)
    }

    return (
        <div className="relative w-full">
            <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                {/* <TextInput /> */}
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                <input
                    value={searchQuery}
                    onChange={(e) => {
                        const newValue = e.target.value
                        setSearchQuery(newValue)
                        setFilter({
                            ...filter,
                            name: newValue,
                        })
                        setIsOpen(newValue.length > 0)
                        setHasTyped(newValue.length > 0)
                        onSearchChange?.(newValue)
                    }}
                    onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
                    placeholder="Search by student name, ID, or email..."
                    className={`h-12 w-full rounded-lg border-2 pl-16 pr-6  shadow-lg transition-all focus-visible:ring-4 placeholder:text-sm text-sm  ${
                        hasTyped &&
                        data?.data?.length === 0 &&
                        searchQuery.length > 2
                            ? 'border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/10'
                            : 'focus-visible:border-primaryNew focus-visible:ring-primaryNew/10'
                    }`}
                />
                <AnimatePresence mode="wait">
                    {isLoading || isFetching ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                rotate: {
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'linear',
                                },
                            }}
                            className="absolute z-50 right-6 top-1/2 -translate-y-1/2"
                        >
                            <Loader2 className="h-5 w-5 text-primaryNew" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sparkles"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, rotate: [0, 10, -10, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 0.2 },
                                rotate: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            className="absolute right-6 top-1/2 -translate-y-1/2"
                        >
                            <Sparkles className="h-5 w-5 text-primaryNew" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isOpen && searchQuery.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 z-50 w-full rounded-2xl border-2 border-border bg-card shadow-2xl"
                    >
                        {isError ? (
                            <NoData
                                isError
                                text="There is some technical issue!"
                            />
                        ) : null}
                        {isLoading || isFetching ? (
                            <LoadingAnimation />
                        ) : data?.data &&
                          data?.data?.length > 0 &&
                          isSuccess ? (
                            <Command>
                                <CommandList>
                                    <CommandGroup>
                                        {data?.data?.map(
                                            (
                                                student: Student,
                                                index: number
                                            ) => (
                                                <motion.div
                                                    key={student.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                    }}
                                                >
                                                    <CommandItem
                                                        onSelect={() =>
                                                            handleSelectStudent(
                                                                student
                                                            )
                                                        }
                                                        className="flex cursor-pointer items-center gap-4 rounded-xl p-4 text-gray-700! !hover:text-gray-700 transition-colors hover:bg-blue-50"
                                                    >
                                                        <InitialAvatar
                                                            name={
                                                                student?.user
                                                                    ?.name ||
                                                                'U'
                                                            }
                                                            imageUrl={
                                                                student?.user
                                                                    ?.avatar
                                                            }
                                                        />

                                                        <div className="flex-1">
                                                            <div className="font-medium">
                                                                {
                                                                    student
                                                                        ?.user
                                                                        ?.name
                                                                }{' '}
                                                                {
                                                                    student?.familyName
                                                                }
                                                            </div>
                                                            <div className="text-sm ">
                                                                {ellipsisText(
                                                                    student?.studentId,
                                                                    8
                                                                )}{' '}
                                                                •{' '}
                                                                {
                                                                    student
                                                                        ?.user
                                                                        ?.email
                                                                }
                                                            </div>
                                                            {student?.courses &&
                                                                student?.courses
                                                                    ?.length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                                        {student?.courses?.map(
                                                                            (
                                                                                course
                                                                            ) => (
                                                                                <Badge
                                                                                    text={
                                                                                        course?.title
                                                                                    }
                                                                                    variant="primaryNew"
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </CommandItem>
                                                </motion.div>
                                            )
                                        )}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        ) : (
                            isSuccess && (
                                <NoResultsInDropdown
                                    searchQuery={searchQuery}
                                />
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
