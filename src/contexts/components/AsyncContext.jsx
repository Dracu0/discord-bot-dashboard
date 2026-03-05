import React from "react";
import { Locale } from "../../utils/Language";
import { Button } from "components/ui/button";
import { Spinner } from "components/ui/spinner";
import { Skeleton } from "components/ui/skeleton";

export function QueryHolder({ query, children, nullable }) {
  const { error, isLoading, refetch } = query;

  if (error) {
    return <ErrorPanel error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span>
            <Locale zh="\u6b63\u5728\u52a0\u8f09..." en="Loading..." />
          </span>
        </div>
      </div>
    );
  }

  if (nullable || query.data != null) {
    return parseChildren(children);
  }

  return <></>;
}

export function Query({ query, children, placeholder }) {
  const { error, isLoading, refetch } = query;

  if (error) {
    return <ErrorPanel error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return placeholder;
  }

  if (query.data != null) {
    return parseChildren(children);
  }

  return <></>;
}

export function QueryHolderSkeleton({ query, height = 200, children, count = 1, nullable = false }) {
  const { error, isLoading, refetch } = query;

  if (error) {
    return <ErrorPanel error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return [...Array(count)].map((_, i) => (
      <Skeleton key={i} style={{ height }} className="rounded-[var(--radius-lg)]" />
    ));
  }

  if (nullable || query.data != null) {
    return parseChildren(children);
  }

  return <></>;
}

function parseChildren(children) {
  return typeof children === "function" ? children() : children;
}

export function ErrorPanel({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-2">
        <span>
          <Locale zh="\u52a0\u8f09\u5931\u6557" en="Failed to load" />
        </span>
        <Button onClick={onRetry}>
          <Locale zh="\u518d\u8a66\u4e00\u6b21" en="Try Again" />
        </Button>
      </div>
    </div>
  );
}
