import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";
import clsx from "clsx";
const cn = (...args) => clsx(...args);


export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef((props, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-gray-200 p-1 text-gray-700",
        props.className
      )}
      {...props}
    />
  );
});

export const TabsTrigger = React.forwardRef((props, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-300 data-[state=active]:bg-white data-[state=active]:text-black",
        props.className
      )}
      {...props}
    />
  );
});

export const TabsContent = React.forwardRef((props, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-2 p-4 rounded border", props.className)}
      {...props}
    />
  );
});
