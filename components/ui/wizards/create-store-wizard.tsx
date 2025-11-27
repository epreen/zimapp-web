"use client"

import { useState } from "react"
import {WizardProgress} from "@/components/ui/wizards/ui/wizard-progress-bar";
import {Button} from "@/components/ui/button";
import {StoreFormData} from "@/app/(protected)/hub/create-store/page";

interface CreateStoreWizardInterface {
    steps: any[]
    initialData: StoreFormData
    onFinish: (data: StoreFormData) => void
}

export function CreateStoreWizard({ steps, initialData, onFinish }: CreateStoreWizardInterface) {
    const [step, setStep] = useState(0)
    const [data, setData] = useState(initialData)

    const update = (values: Partial<StoreFormData>) => {
        setData({ ...data, ...values })
    }

    const next = () => {
        setStep((s) => s + 1)
    }

    const back = () => {
        setStep((s) => s - 1)
    }

    const StepComponent = steps[step]

    return (
        <div className="space-y-6 max-w-2xl">
            <WizardProgress total={steps.length} current={step} />

            <div id="wizard" className="transition-all">
                <StepComponent data={data} update={update} />
            </div>

            <div className="flex justify-between">
                {step > 0 && step < steps.length - 1 && (
                    <Button onClick={back} variant="outline">Back</Button>
                )}

                {step < steps.length - 2 && (
                    <Button onClick={next} className="ml-auto bg-primary dark:bg-secondary text-background">Next</Button>
                )}

                {step === steps.length - 2 && (
                    <Button onClick={next} className="ml-auto bg-primary dark:bg-secondary text-background">Finish</Button>
                )}

                {step === steps.length - 1 && (
                    <Button onClick={() => onFinish(data)} className="ml-auto bg-primary dark:bg-secondary text-background">Submit</Button>
                )}
            </div>
        </div>
    )
}
