"use client";

import { useActionState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/db/schema";
import { updateDisplayName } from "../actions";
import { ActionState } from "@/lib/middleware";
import { Button } from "@/components/ui/button";

interface DisplayNameProps {
  user: User;
}

export function DisplayName({ user }: DisplayNameProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateDisplayName,
    { error: "" },
  );

  useEffect(() => {
    if (pending) return;
    if (state?.success) {
      toast("Display name updated successfully!", {
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
    if (state?.error) {
      toast(state.error, {
        icon: <AlertTriangle className="text-destructive h-4 w-4" />,
      });
    }
  }, [pending, state.error, state?.success]);

  return (
    <form action={formAction}>
      <Card className="pb-0">
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-2">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="name"
                name="name"
                defaultValue={state.values?.name || user.name || ""}
              />
            </div>

            {state?.error && (
              <div className="text-destructive text-sm font-medium">
                {state.error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted flex justify-between py-2.5">
          <p className="text-muted-foreground text-sm">
            Please use 32 characters at maximum.
          </p>
          <Button type="submit" disabled={pending}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
