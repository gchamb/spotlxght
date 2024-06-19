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
import * as path from "node:path";
import { type FormEvent } from "react";

export default function UploadButton() {
  const onFileUpload = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("file upload");
    const file = e.target;
    console.log(file);
    // const formData = new FormData();
    // formData.append("file", file);
    try {
      // const res = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await res.json();
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="text-lg">
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent onSubmit={onFileUpload} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Upload Content
          </DialogTitle>
          <DialogDescription className=" text-center">
            Show off your talent to venues
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div className="mb-4 flex h-64 w-64 items-center justify-center rounded-3xl bg-[#222222] hover:cursor-pointer">
              {/*<input type="file" />*/}
              <svg
                width="42"
                height="42"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <p className="mb-[-24px] text-center text-[12px]">
            only allow snippets of 20s or less for music and video files
          </p>
        </div>
        <DialogFooter className="flex ">
          <Button type="submit" className="w-full">
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
