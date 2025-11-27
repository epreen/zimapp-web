import {AiOutlineCheckCircle} from "react-icons/ai";

interface FormSuccessInterface {
    message?: string;
}

export const FormSuccess = ({message}: FormSuccessInterface) => {
    if (!message) return null;

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive text-emerald-500">
            <AiOutlineCheckCircle className="h-4 w-4"/>
            <p>
                {message}
            </p>
        </div>
    )
}