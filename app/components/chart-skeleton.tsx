import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ChartSkeleton() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="mx-auto h-[260px] w-full max-w-xs animate-pulse rounded-full bg-muted" />
      </CardContent>
    </Card>
  );
}