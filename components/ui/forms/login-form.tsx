"use client";

import * as z from "zod"

import {CardWrapper} from "@/components/ui/wrappers/card-wrapper";
import {useForm} from "react-hook-form";
import {LoginSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/ui/forms/form-error";
import {FormSuccess} from "@/components/ui/forms/form-success";
import {useState, useTransition} from "react";
import {login} from "@/actions/auth/login";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError(undefined)
        setSuccess(undefined)

        startTransition(() => {
            login(values).then((data) => {
                setError(data?.error)
                setSuccess(data?.success)
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={
                                ({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Enter your email account"
                                                type="email"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={
                                ({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Enter your password"
                                                type="password"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-primary text-background dark:bg-secondary dark:text-primary-foreground"
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
