import { Button, GlobalModal, Typography } from '@components'
import { SubAdminApi } from '@queries'
import { TiWarning } from 'react-icons/ti'

export const SwitchOffFlagModal = ({ onCancel, studentId }: any) => {
    const [problamaticStudent, problamaticStudentResult] =
        SubAdminApi.Student.useProblamaticStudent()
    return (
        <div>
            <GlobalModal>
                <div className="flex flex-col justify-center items-center gap-y-4 px-20 py-10">
                    <div>
                        <TiWarning className="text-yellow-500" size={55} />
                    </div>
                    <div className="fex flex-col gap-y-8 justify-center items-center mb-5">
                        <Typography variant="h4" center>
                            Are you sure?
                        </Typography>
                        <Typography variant="body" center>
                            You want to switch the flag OFF?
                        </Typography>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <Button onClick={onCancel} outline variant="error">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                problamaticStudent({ studentId }).then(() => {
                                    onCancel()
                                })
                            }}
                            loading={problamaticStudentResult.isLoading}
                            disabled={problamaticStudentResult.isLoading}
                        >
                            Yes
                        </Button>
                    </div>
                </div>
            </GlobalModal>
        </div>
    )
}
