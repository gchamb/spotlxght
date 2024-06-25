"use client";

import React from "react";
import { type Asset } from "~/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import VideoPlayer from "~/components/profile/components/video-player";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteAsset } from "~/server/actions/profile";

export default function MainContent({
  content,
  userId,
  isCurrentUser,
}: {
  content: (Asset & { sasUrl?: string })[];
  userId: string;
  isCurrentUser: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      {!content.length && (
        <div className="flex justify-center">
          <h1>No posts yet.</h1>
        </div>
      )}
      {content.map((asset) => (
        <div key={asset.id} className="relative flex gap-6">
          <Avatar>
            <AvatarImage src="/images/edm.jpg" alt="profile picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center justify-between">
              <div className="my-1">
                <h1 className="font-semibold">{asset.title}</h1>
                <h2>{asset.description}</h2>
              </div>
              {isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/*<DropdownMenuLabel>Actions</DropdownMenuLabel>*/}
                    {/*<DropdownMenuItem*/}
                    {/*  onClick={() => navigator.clipboard.writeText("hi")}*/}
                    {/*>*/}
                    {/*  Copy payment ID*/}
                    {/*</DropdownMenuItem>*/}
                    {/*<DropdownMenuSeparator />*/}
                    {/*<DropdownMenuItem>Edit</DropdownMenuItem>*/}
                    {/*<DropdownMenuItem>*/}
                    {/*  <AlertDialog>*/}
                    {/*    <AlertDialogTrigger asChild>*/}
                    {/*      <p className="h-full w-full text-red-600">Delete</p>*/}
                    {/*    </AlertDialogTrigger>*/}
                    {/*    <AlertDialogContent>*/}
                    {/*      <AlertDialogHeader>*/}
                    {/*        <AlertDialogTitle>*/}
                    {/*          Are you absolutely sure?*/}
                    {/*        </AlertDialogTitle>*/}
                    {/*        <AlertDialogDescription>*/}
                    {/*          This action cannot be undone. This will permanently*/}
                    {/*          delete your account and remove your data from our*/}
                    {/*          servers.*/}
                    {/*        </AlertDialogDescription>*/}
                    {/*      </AlertDialogHeader>*/}
                    {/*      <AlertDialogFooter>*/}
                    {/*        <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
                    {/*        <AlertDialogAction>Continue</AlertDialogAction>*/}
                    {/*      </AlertDialogFooter>*/}
                    {/*    </AlertDialogContent>*/}
                    {/*  </AlertDialog>*/}
                    {/*</DropdownMenuItem>*/}
                    <DropdownMenuItem
                      onClick={async () => deleteAsset(asset.id, userId)}
                    >
                      <p className="font-bold text-red-600">Delete</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="mt-4">
              <VideoPlayer asset={asset} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
