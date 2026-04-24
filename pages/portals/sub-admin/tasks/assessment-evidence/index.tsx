import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import {
    AssessmentSubmissionsCount,
    NextPageWithLayout,
    PermissionType,
    SubAdminAssessmentsFiltersType,
} from '@types'

//components
import {
    Filter,
    LoadingAnimation,
    Modal,
    PageTitle,
    SubAdminAssessmentsFilters,
    TabNavigation,
    TabProps,
    TechnicalError,
    TextInput,
    withPermission,
} from '@components'
// queries
import { Result } from '@constants'
import { useSubadminProfile } from '@hooks'
import {
    AllDocumentsSubmitted,
    ArchivedAssessment,
    CompetentAssessment,
    FilteredAssessments,
    NonCompetentAssessment,
    PendingAssessment,
    ReOpenedAssessment,
} from '@partials/sub-admin'
import {
    SubAdminApi,
    useAssessmentCountQuery,
    useGetAssessmentEvidenceQuery,
} from '@queries'
import { checkFilteredDataLength, getCountData, getFilterQuery } from '@utils'

type Props = {}

const filterKeys = [
    'name',
    'email',
    'phone',
    'studentId',
    'result',
    'rtoId',
    'courseId',
    'studentMaskedId',
]

const AssessmentEvidence: NextPageWithLayout = (props: Props) => {
    const router = useRouter()

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<SubAdminAssessmentsFiltersType>(
        {} as SubAdminAssessmentsFiltersType
    )
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [modal, setModal] = useState<any | null>(null)
    const [studentId, setStudentId] = useState<any | null>(null)
    const [studentIdValue, setStudentIdValue] = useState<string>('')
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    const subadmin = useSubadminProfile()

    const query = getFilterQuery<SubAdminAssessmentsFiltersType>({
        router,
        filterKeys,
    })
    useEffect(() => {
        setFilter(query as SubAdminAssessmentsFiltersType)
    }, [router])

    const count = useAssessmentCountQuery()
    const profile = SubAdminApi.SubAdmin.useProfile(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const filteredAssessments = useGetAssessmentEvidenceQuery(
        {
            search: `${JSON.stringify({
                ...filter,
                ...studentId,
                ...studentName,
            })
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
            skip: !Object.keys(filter).length,
        }
    )

    const onCancel = () => {
        setModal(null)
    }

    useEffect(() => {
        if (
            profile?.isSuccess &&
            profile.data &&
            !profile.data?.receiveStudentAssessment
        ) {
            setModal(
                <Modal
                    onConfirmClick={onCancel}
                    title={'Student Assessments'}
                    subtitle={'Student Assessments'}
                    onCancelClick={onCancel}
                    showActions={false}
                >
                    You need to enable Student Assessments from Setting to
                    recive Student Assessments
                </Modal>
            )
        }
        return () => {
            setModal(null)
        }
    }, [profile])

    const assessMentCount = getCountData<AssessmentSubmissionsCount>(
        count?.data as AssessmentSubmissionsCount[]
    )

    const tabs: TabProps[] = [
        ...(!subadmin?.isAssociatedWithRto
            ? [
                  {
                      label: 'Pending',
                      href: {
                          pathname: 'assessment-evidence',
                          query: { tab: Result.Pending },
                      },
                      badge: {
                          text: assessMentCount?.pending,
                          loading: count.isLoading,
                      },
                      element: <PendingAssessment />,
                  },
              ]
            : []),
        // AllDocumentsSubmitted
        {
            label: 'All Documents Submitted',
            href: {
                pathname: 'assessment-evidence',
                query: { tab: Result.AllDocumentSubmitted },
            },
            badge: {
                text: assessMentCount?.allDocumentSubmitted,
                loading: count.isLoading,
            },
            element: <AllDocumentsSubmitted />,
        },
        {
            label: 'Competent',
            href: {
                pathname: 'assessment-evidence',
                query: { tab: Result.Competent },
            },
            badge: {
                text: assessMentCount?.competent,
                loading: count.isLoading,
            },
            element: <CompetentAssessment />,
        },

        {
            label: 'Non-Competent',
            href: {
                pathname: 'assessment-evidence',
                query: { tab: 'non-competent' },
            },
            badge: {
                text: assessMentCount?.notCompetent,
                loading: count.isLoading,
            },
            element: <NonCompetentAssessment />,
        },
        {
            label: 'Re-Opened',
            href: {
                pathname: 'assessment-evidence',
                query: { tab: 're-opened' },
            },
            badge: {
                text: assessMentCount?.reOpened,
                loading: count.isLoading,
            },
            element: <ReOpenedAssessment />,
        },
        {
            label: 'Archive',
            href: {
                pathname: 'assessment-evidence',
                query: { tab: 'archived' },
            },
            badge: {
                text: assessMentCount?.archived,
                loading: count.isLoading,
            },
            element: <ArchivedAssessment />,
        },
    ]

    const delayedSearch = useCallback(
        debounce((value) => {
            setStudentId({ studentId: value })
        }, 700),
        []
    )

    const delayedNameSearch = useCallback(
        debounce((value) => {
            setStudentName({ name: value })
        }, 700),
        []
    )

    const filteredDataLength = checkFilteredDataLength({
        ...filter,
        ...(studentId?.studentId ? studentId : {}),
        ...(studentName?.name ? studentName : {}),
    })

    return (
        <>
            {modal}
            <div className="flex justify-between items-end">
                <PageTitle
                    title={'Assessment Submissions'}
                    backTitle={'Back'}
                    navigateBack
                />
                <div className="flex justify-end gap-x-2 mb-2">
                    <div className="w-60">
                        <TextInput
                            name={'name'}
                            placeholder={'Search by Student Name'}
                            value={studentNameValue}
                            onChange={(e: any) => {
                                setStudentNameValue(e.target.value)
                                delayedNameSearch(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <TextInput
                            name={'studentId'}
                            placeholder={'Search by Student Id'}
                            value={studentIdValue}
                            onChange={(e: any) => {
                                setStudentIdValue(e.target.value)
                                delayedSearch(e.target.value)
                            }}
                        />
                    </div>
                    <div className="flex-shrink-0">{filterAction}</div>
                </div>
            </div>
            <div className="py-4">
                <Filter<SubAdminAssessmentsFiltersType>
                    component={SubAdminAssessmentsFilters}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                    filterKeys={filterKeys}
                />
            </div>

            {filteredDataLength && filteredAssessments.isError && (
                <TechnicalError />
            )}
            {filteredDataLength ? (
                filteredAssessments.isLoading ? (
                    <LoadingAnimation />
                ) : (
                    filteredAssessments.isSuccess && (
                        <FilteredAssessments
                            setPage={setPage}
                            itemPerPage={itemPerPage}
                            assessments={filteredAssessments}
                            setItemPerPage={setItemPerPage}
                        />
                    )
                )
            ) : null}

            {!filteredDataLength && (
                <TabNavigation tabs={tabs}>
                    {({ header, element }: any) => {
                        return (
                            <div>
                                <div>{header}</div>
                                <div className="p-4">{element}</div>
                            </div>
                        )
                    }}
                </TabNavigation>
            )}
        </>
    )
}
AssessmentEvidence.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(AssessmentEvidence, {
    permissions: [PermissionType.SUBMISSIONS],
})
