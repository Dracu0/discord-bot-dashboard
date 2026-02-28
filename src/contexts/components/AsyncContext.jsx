import { Button, Center, Skeleton, Loader, Stack, Text } from "@mantine/core";
import React from "react";
import { Locale } from "../../utils/Language";

export function QueryHolder({ query, children, nullable }) {
  const { error, isLoading, refetch } = query;

  if (error) {
    return <ErrorPanel error={error} onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text>
            <Locale zh="正在加載..." en="Loading..." />
          </Text>
        </Stack>
      </Center>
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
      <Skeleton key={i} height={height} radius="lg" />
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
    <Center mih={200}>
      <Stack align="center" gap="sm">
        <Text>
          <Locale zh="加載失敗" en="Failed to load" />
        </Text>
        <Button onClick={onRetry}>
          <Locale zh="再試一次" en="Try Again" />
        </Button>
      </Stack>
    </Center>
  );
}