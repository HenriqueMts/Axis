import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress(props: Readonly<ProgressPrimitive.ProgressProps>) {
  return (
    <ProgressPrimitive.Progress
      {...props}
      className="bg-zinc-900 rounded-full h-2"
    />
  );
}

export function ProgressIndicator(
  props: Readonly<ProgressPrimitive.ProgressIndicatorProps>
) {
  return (
    <ProgressPrimitive.Indicator
      {...props}
    
      className="bg-linear-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all duration-500"
    />
  );
}