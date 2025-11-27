import {ReactNode} from "react";

interface IconWrapperInterface {
    children: ReactNode;
    className?: string;
}

export const IconWrapper = ({ children, className }: IconWrapperInterface) => (
    <span className={className}>{children}</span>
);