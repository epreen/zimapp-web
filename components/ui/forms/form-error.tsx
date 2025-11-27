import {LiaExclamationTriangleSolid} from "react-icons/lia";

interface FormErrorInterface {
    message?: string;
}

export const FormError = ({message}: FormErrorInterface) => {
    if (!message) return null;

    return (
        <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive text-red-500">
            <LiaExclamationTriangleSolid className="h-4 w-4"/>
            <p>
                {message}
            </p>
        </div>
    )
}