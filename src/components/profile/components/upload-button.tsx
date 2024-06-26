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

export default function UploadButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetFormState = () => {
    uploadFileForm.reset();
    setOpen(false);
    setDescriptionVisible(false);
  };

  // TODO: Update UI for post and audio uploads
  // TODO: Create html file ref to determine duration of video
  // TODO: Allow only video and audio files
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

    try {
      await uploadFile(
        userId,
        formData,
        AzureBlobContainer.ASSET,
        values.title,
        values.description,
      );
    } catch (err) {
      console.error(err);
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

                  {/*<svg*/}
                  {/*  width="42"*/}
                  {/*  height="42"*/}
                  {/*  viewBox="0 0 15 15"*/}
                  {/*  fill="none"*/}
                  {/*  xmlns="http://www.w3.org/2000/svg"*/}
                  {/*>*/}
                  {/*  <path*/}
                  {/*    d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"*/}
                  {/*    fill="currentColor"*/}
                  {/*    fillRule="evenodd"*/}
                  {/*    clipRule="evenodd"*/}
                  {/*  ></path>*/}
                  {/*</svg>*/}
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
