"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { AzureBlobContainer, uploadFileFormSchema } from "~/lib/types";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react";
import { uploadFile } from "~/server/actions/profile";
import { toast } from "sonner";

export default function UploadDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetFormState = () => {
    uploadFileForm.reset();
    setOpen(false);
    setDescriptionVisible(false);
  };

  // TODO: Create html file ref to determine duration of video
  const uploadFileForm = useForm<z.infer<typeof uploadFileFormSchema>>({
    resolver: zodResolver(uploadFileFormSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
      uploadItem: undefined,
    },
  });

  const onFileUpload: SubmitHandler<{
    title: string;
    description?: string | null;
    uploadItem: File | null;
  }> = async (values: z.infer<typeof uploadFileFormSchema>) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("uploadItem", values.uploadItem!);
    resetFormState();
    console.log(values);

    const error = await uploadFile(
      userId,
      formData,
      AzureBlobContainer.ASSET,
      values.title,
      values.description,
    );

    if (error) {
      // in future show error in the dialog
      // currently the dialog closes on success or failure
      // uploadFileForm.setError("root", {
      //   message: error.message,
      // });

      // for now toast the error
      toast(error.message);
    }

    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((prevOpen) => {
          if (prevOpen) {
            resetFormState();
          }
          return !prevOpen;
        });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Upload</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <Form {...uploadFileForm}>
          <form onSubmit={uploadFileForm.handleSubmit(onFileUpload)}>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                Upload Content
              </DialogTitle>
              <DialogDescription className=" text-center">
                Show off your talent to venues
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pb-4">
              <div className="flex items-center justify-center">
                <div className="flex w-64 flex-col items-center justify-center gap-3 py-12">
                  {uploadFileForm.formState.errors.title?.message && (
                    <p className="mb-[-16px] text-center text-sm text-red-600">
                      {uploadFileForm.formState.errors.title.message}
                    </p>
                  )}
                  <FormField
                    name="title"
                    control={uploadFileForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {descriptionVisible && (
                    <>
                      {uploadFileForm.formState.errors.description?.message && (
                        <p className="mb-[-16px] text-center text-sm text-red-600">
                          {uploadFileForm.formState.errors.description.message}
                        </p>
                      )}
                      <FormField
                        control={uploadFileForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value ?? ""}
                                placeholder="description (optional)"
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {uploadFileForm.formState.errors.uploadItem?.message && (
                    <p className="mb-[-16px] mt-4 text-center text-sm text-red-600">
                      {uploadFileForm.formState.errors.uploadItem.message}
                    </p>
                  )}
                  <FormField
                    control={uploadFileForm.control}
                    name="uploadItem"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className="block bg-white text-black"
                            disabled={field.disabled}
                            onBlur={field.onBlur}
                            ref={(ref) => {
                              field.ref(ref);
                            }}
                            onChange={(e) => {
                              const { files } = e.currentTarget;
                              if (!files?.[0]) {
                                return;
                              }

                              if (files[0].type.includes("video")) {
                                setDescriptionVisible(true);
                              } else {
                                setDescriptionVisible(false);
                              }

                              uploadFileForm.clearErrors("uploadItem");
                              if (files[0].size > 5 * 1024 * 1024) {
                                uploadFileForm.setError("uploadItem", {
                                  type: "maxFileSize",
                                  message:
                                    "The upload must be a maximum of 5MB.",
                                });
                              }
                              if (
                                !files[0].type.includes("video") &&
                                !files[0].type.includes("audio")
                              ) {
                                uploadFileForm.setError("uploadItem", {
                                  type: "fileType",
                                  message:
                                    "Only MP3, WAV, OGG, MP4, OGG, and WEBM files are allowed to be uploaded.",
                                });
                              }

                              // const duration = await getDuration(files[0]);
                              // if (duration....)

                              uploadFileForm.setValue("uploadItem", files[0]);
                            }}
                            name={field.name}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <p className="mb-[-8px] text-center text-[12px]">
                upload size limit: 5MB
              </p>
            </div>
            <DialogFooter className="flex">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
