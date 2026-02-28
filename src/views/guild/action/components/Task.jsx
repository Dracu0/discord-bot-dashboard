import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "api/internal";
import Card from "components/card/Card";
import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { Locale } from "utils/Language";
import Modal from "components/modal/Modal";

function useDeleteMutation(guild, action, task) {
    const client = useQueryClient();

    return useMutation({
        mutationFn: () => deleteTask(guild, action, task),
        onSuccess() {
            return client.setQueryData(
                ["action_detail", guild, action],
                (data) =>
                    data
                        ? { ...data, tasks: data.tasks.filter((t) => t.id !== task) }
                        : data
            );
        },
    });
}

export function Task({ task }) {
    const { id: guild, action } = useParams();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const deleteMutation = useDeleteMutation(guild, action, task.id);

    const configUrl = `/guild/${guild}/actions/${action}/task/${task.id}`;
    const createdAt = new Date(Date.parse(task.createdAt));

    return (
        <Card p={5} gap={5}>
            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                size="sm"
                header={{ zh: "確認刪除", en: "Confirm Delete" }}
            >
                <Stack gap="md">
                    <Text fz="sm">
                        <Locale
                            zh={`確定要刪除任務「${task.name}」嗎？此操作無法撤銷。`}
                            en={`Are you sure you want to delete task "${task.name}"? This action cannot be undone.`}
                        />
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => setConfirmOpen(false)}>
                            <Locale zh="取消" en="Cancel" />
                        </Button>
                        <Button
                            color="red"
                            onClick={() => {
                                deleteMutation.mutate();
                                setConfirmOpen(false);
                            }}
                            loading={deleteMutation.isPending}
                        >
                            <Locale zh="刪除" en="Delete" />
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Flex direction="row" gap={5}>
                <Stack align="flex-start" gap={0}>
                    <Text fz="lg" fw="bold">
                        {task.name}
                    </Text>
                    <Group>
                        <Text miw="fit-content" fw="bold">
                            <Locale zh="創建於: " en="Created At: " />
                        </Text>
                        <Text>{createdAt.toLocaleString()}</Text>
                    </Group>
                </Stack>

                <Button
                    ml="auto"
                    variant="filled"
                    color="red"
                    onClick={() => setConfirmOpen(true)}
                    loading={deleteMutation.isPending}
                >
                    <Locale zh="刪除" en="Delete" />
                </Button>
            </Flex>
            <Box w={{ base: "100%", md: "fit-content" }}>
                <Button component={Link} to={configUrl} w="100%" px={10} variant="light">
                    <Locale zh="修改選項" en="Modify Options" />
                </Button>
            </Box>
        </Card>
    );
}