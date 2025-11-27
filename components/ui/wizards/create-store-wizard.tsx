"use client"

import { JSX, useState } from "react"
import {WizardProgress} from "@/components/ui/wizards/ui/wizard-progress-bar";
import {Button} from "@/components/ui/button";
import { StoreFormData } from "@/lib/types";

interface WizardStep {
    (props: { data: StoreFormData; update: (values: Partial<StoreFormData>) => void }): JSX.Element;
}

interface CreateStoreWizardInterface {
    steps: WizardStep[]
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

    if (steps.length === 0) {
        return <div>No steps configured</div>
    }

    const StepComponent = steps[step]

    if (!StepComponent) {
        return <div>Invalid step</div>
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <WizardProgress total={steps.length} current={step} />

            <div id="wizard" className="transition-all">
                <StepComponent data={data} update={update} />            </div>

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
