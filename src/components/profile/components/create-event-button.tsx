"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import CreateEventDialog from "~/components/create-event-dialog";

export default function CreateEventButton({}: {}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Create Event</Button>
      <CreateEventDialog open={open} onClose={handleClose} />
    </>
  );
}
