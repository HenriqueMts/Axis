import * as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog(props: Readonly<DialogPrimitive.DialogProps>) {
  return <DialogPrimitive.Dialog {...props} />;
}

export function DialogTrigger(
  props: Readonly<DialogPrimitive.DialogTriggerProps>
) {
  return <DialogPrimitive.DialogTrigger {...props} />;
}

export function DialogClose(props: Readonly<DialogPrimitive.DialogCloseProps>) {
  return <DialogPrimitive.DialogClose {...props} />;
}

export function DialogPortal(
  props: Readonly<DialogPrimitive.DialogPortalProps>
) {
  return <DialogPrimitive.DialogPortal {...props} />;
}

export function DialogOverlay(
  props: Readonly<DialogPrimitive.DialogOverlayProps>
) {
  return (
    <DialogPrimitive.DialogOverlay
      {...props}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    />
  );
}

export function DialogContent(
  props: Readonly<DialogPrimitive.DialogContentProps>
) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.DialogContent
        {...props}
        className="fixed z-50 right-0 top-0 bottom-0 w-full sm:w-96 md:w-[500px] h-screen border-l border-zinc-900 bg-zinc-950 p-4 sm:p-6 md:p-8 overflow-y-auto"
      />
    </DialogPortal>
  );
}

export function DialogTitle(props: Readonly<DialogPrimitive.DialogTitleProps>) {
  return (
    <DialogPrimitive.DialogTitle {...props} className="text-lg font-semibold" />
  );
}

export function DialogDescription(
  props: Readonly<DialogPrimitive.DialogDescriptionProps>
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className="text-zinc-400 text-sm leading-relaxed"
    />
  );
}
