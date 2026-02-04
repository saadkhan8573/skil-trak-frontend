import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button, TextInput } from '@components';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { PlacementFormValues } from '../hooks/usePlacementFormUrl';

interface PlacementFormUrlFormProps {
    methods: UseFormReturn<PlacementFormValues>;
    handleSave: (data: PlacementFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function PlacementFormUrlForm({
    methods,
    handleSave,
    onCancel,
    isLoading
}: PlacementFormUrlFormProps) {
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSave)} className="space-y-3">
                <motion.div
                    key="editing"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-3"
                >
                    {/* URL Input */}
                    <TextInput
                        name="url"
                        label="Form URL"
                        placeholder="https://example.com/placement-form"
                        type="url"
                        disabled={isLoading}
                    />

                    {/* Info Note */}
                    <div className="bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg p-3 border border-[#BFDBFE]">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                            <p className="text-[10px] text-[#1E40AF] leading-relaxed">
                                This URL will automatically open in a new tab when a student approves a placement at this workplace. Ensure the form is accessible to external users.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            submit
                            Icon={CheckCircle}
                            className="flex-1 bg-linear-to-br from-[#F7A619] to-[#EA580C] border-none text-white hover:shadow-lg transition-all"
                            text="Save URL"
                            loading={isLoading}
                        />
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            outline
                            className="px-4"
                            text="Cancel"
                            disabled={isLoading}
                        />
                    </div>
                </motion.div>
            </form>
        </FormProvider>
    );
}
