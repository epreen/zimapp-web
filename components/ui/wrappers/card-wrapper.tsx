"use client";

import {ReactNode} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Header} from "@/components/auth/header";
import {Socials} from "@/components/auth/socials";
import {BackButton} from "@/components/auth/buttons/back-button";

interface CardWrapperInterface {
    children: ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper= ({
                               children,
                               headerLabel,
                               backButtonLabel,
                               backButtonHref,
                               showSocial
}: CardWrapperInterface) => {
    return (
        <Card className="w-[400px] shadow-md rounded-md bg-white dark:bg-black py-6">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter className="flex justify-center items-center">
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}