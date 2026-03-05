import React from 'react';
import { Center, Stack, Title, Text, Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  componentDidMount() {
    this._onError = (event) => {
      console.error('[Global Error]', event);
    };
    this._onRejection = (event) => {
      console.error('[Unhandled Rejection]', event);
    };
    window.addEventListener('error', this._onError);
    window.addEventListener('unhandledrejection', this._onRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this._onError);
    window.removeEventListener('unhandledrejection', this._onRejection);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Center h="100vh" p="xl">
          <Stack align="center" gap="md" maw={480}>
            <IconAlertTriangle size={48} color="var(--mantine-color-red-5)" />
            <Title order={2} ta="center">Something went wrong</Title>
            <Text c="dimmed" ta="center" fz="md">
              An unexpected error occurred. Please try refreshing the page.
            </Text>
            {this.state.error?.message && (
              <Text
                c="red.4"
                fz="sm"
                ta="center"
                p="sm"
                bg="var(--status-error-bg)"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', wordBreak: 'break-word' }}
              >
                {this.state.error.message}
              </Text>
            )}
            <Button
              onClick={() => window.location.reload()}
              variant="filled"
              color="brand"
              size="md"
            >
              Refresh Page
            </Button>
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}
