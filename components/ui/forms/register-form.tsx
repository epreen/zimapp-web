"use client";

import * as z from "zod";
import { CardWrapper } from "@/components/ui/wrappers/card-wrapper";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/forms/form-error";
import { FormSuccess } from "@/components/ui/forms/form-success";
import { useState, useTransition } from "react";
import {register} from "@/actions/auth/register";

// Define a local schema that includes first/last name for the form
const ExtendedRegisterSchema = z.object({
    firstName: z.string().min(1, { message: "Firstname is required" }),
    lastName: z.string().min(1, { message: "Lastname is required" }),
    email: RegisterSchema.shape.email,
    password: RegisterSchema.shape.password,
});

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ExtendedRegisterSchema>>({
        resolver: zodResolver(ExtendedRegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ExtendedRegisterSchema>) => {
        setError("");
        setSuccess("");

        // Concatenate first + last into `name`
        const name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();

        startTransition(() => {
            register({
                name,
                email: values.email,
                password: values.password,
            }).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl className="flex">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Firstname"
                                                type="text"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl className="flex">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Lastname"
                                                type="text"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Email account"
                                            type="email"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Password"
                                            type="password"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button disabled={isPending} type="submit" className="w-full bg-primary text-background dark:bg-secondary dark:text-primary-foreground">
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
