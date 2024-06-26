import { Music } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { TimeslotProps } from "./timeslot-tabs";
import AudioComponent from "./audio";

type AssetsDialogProps = {
  assets: TimeslotProps["applicants"][number]["assets"];
  name: string;
};

export default function AssetsDialog({ assets, name }: AssetsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-2" variant="ghost">
          <Music />
          View Performances
        </Button>
      </DialogTrigger>
      <DialogContent showX>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {name} Music Samples
          </DialogTitle>
          <DialogDescription>
            See their profile to all their music samples and video performances
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {assets.map((asset) => {
            return (
              asset.mimetype.includes("audio") && (
                <AudioComponent
                  key={asset.azureBlobKey}
                  src={asset.azureBlobKey}
                  mimetype={asset.mimetype}
                />
              )
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
