/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
  values?: Record<string, any>;
  [key: string]: any; // Allow any other properties
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return {
        error: result.error.errors[0]?.message || "An error occurred.",
        values: Object.fromEntries(formData),
      } as T;
    }

    return action(result.data, formData);
  };
}
