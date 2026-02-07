import * as React from "react";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

interface ResizablePanelGroupProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
}

const ResizablePanelGroup: React.FC<ResizablePanelGroupProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  direction = 'horizontal', 
  children, 
  ...props 
}) => (
  <div
    className={cn(
      "flex h-full w-full",
      direction === 'vertical' && "flex-col",
      className
    )}
    data-panel-group-direction={direction}
    {...props}
  >
    {children}
  </div>
);

interface ResizablePanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

const ResizablePanel: React.FC<ResizablePanelProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  defaultSize, 
  children, 
  ...props 
}) => (
  <div
    className={cn("flex-1 overflow-auto", className)}
    style={{ flex: defaultSize ? `${defaultSize} 0 0` : undefined }}
    {...props}
  >
    {children}
  </div>
);

interface ResizableHandleProps {
  withHandle?: boolean;
  className?: string;
}

const ResizableHandle: React.FC<ResizableHandleProps & React.HTMLAttributes<HTMLDivElement>> = ({ 
  withHandle, 
  className, 
  ...props 
}) => (
  <div
    className={cn(
      "relative flex w-px items-center justify-center bg-border",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };