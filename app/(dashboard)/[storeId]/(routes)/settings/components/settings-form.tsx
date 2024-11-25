"use client";

import * as z from "zod";

import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "./heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type settingsType = z.infer<typeof formSchema>;
const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<settingsType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (values: settingsType) => {
    try {
      setLoading(true);
      await axios.patch(`/api/store/${params.storeId}`, values);
      router.refresh();
      router.push("/");
      toast.success("Succesfully updated");
    } catch {
      toast.error("Something went wrong in settingForm");
    } finally {
      setLoading(false);
    }
  };
  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/store/${params.storeId}`);
      toast.success("succesfully deleted");
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      toast.error("Make sure you delete your products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex items-center justify-between ">
        <Heading title="Settings" description="Manage store prefrences" />
        <Button
          disabled={loading}
          variant={"destructive"}
          onClick={() => setOpen(true)}
          size="icon"
        >
          <Trash onClick={() => setOpen(false)} className="h-4 w-4" />
        </Button>
      </div>

      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
