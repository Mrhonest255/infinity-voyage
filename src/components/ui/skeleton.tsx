import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )} 
      {...props} 
    />
  );
}

function TourCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-white border border-border/50 shadow-soft", className)}>
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded-xl" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
        
        {/* Details */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
        </div>
        
        {/* Price and Button */}
        <div className="flex justify-between items-center pt-3 border-t border-border/30">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function TransferCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-white border border-border/50 shadow-soft p-6", className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

function GalleryImageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-muted", className)}>
      <Skeleton className="aspect-square w-full rounded-none" />
    </div>
  );
}

function BookingDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white border border-border/50 shadow-soft p-6 space-y-5", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-5 w-full rounded-lg" />
          </div>
        ))}
      </div>
      
      {/* Status */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border/30">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-5 w-full rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

export { 
  Skeleton, 
  TourCardSkeleton, 
  TransferCardSkeleton, 
  GalleryImageSkeleton,
  BookingDetailSkeleton,
  TableRowSkeleton
};
