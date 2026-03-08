import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "api/internal";
import Card from "components/card/Card";
import { Button } from "components/ui/button";
import { Spinner } from "components/ui/spinner";
import React, { useState } from "react";
import { Locale } from "utils/Language";
import Modal from "components/modal/Modal";
import { useActionInfo } from "contexts/actions/ActionDetailContext";
import { ACTION_COLORS, ACTION_LABELS } from "config/actions/ModHistory";

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

function ActionBadge({ action }) {
    const color = ACTION_COLORS[action] || "#888";
    const label = ACTION_LABELS[action] || action;
    return (
        <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
        >
            {label}
        </span>
    );
}

export function Task({ task }) {
    const { id: guild, action } = useParams();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const actionInfo = useActionInfo();
    const isReadOnly = actionInfo?.readOnly === true;
    const isModHistory = action === "mod_history";

    const deleteMutation = useDeleteMutation(guild, action, task.id);

    const configUrl = `/guild/${guild}/actions/${action}/task/${task.id}`;
    const createdAt = new Date(Date.parse(task.createdAt));

    return (
        <Card className="p-1 gap-1">
            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                size="sm"
                header={{ zh: "確認刪除", en: isModHistory ? "Confirm Delete Entry" : "Confirm Delete" }}
            >
                <div className="flex flex-col gap-4">
                    <span className="text-sm">
                        <Locale
                            zh={`確定要刪除任務「${task.name}」嗎？此操作無法撤銷。`}
                            en={isModHistory
                                ? `Are you sure you want to delete this moderation log entry? This action cannot be undone.`
                                : `Are you sure you want to delete task "${task.name}"? This action cannot be undone.`
                            }
                        />
                    </span>
                    <div className="flex items-center gap-2 justify-end">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            <Locale zh="取消" en="Cancel" />
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                deleteMutation.mutate();
                                setConfirmOpen(false);
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <Spinner size="sm" />}
                            <Locale zh="刪除" en="Delete" />
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="flex flex-wrap gap-2">
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isModHistory && task.action && <ActionBadge action={task.action} />}
                        <span className="text-lg font-bold">
                            {task.name}
                        </span>
                    </div>
                    {isModHistory && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-(--text-secondary)">
                            {task.targetId && <span>Target: <span className="font-mono select-all">{task.targetId}</span></span>}
                            {task.moderatorId && <span>By: <span className="font-mono select-all">{task.moderatorId}</span></span>}
                            {task.reason && <span className="truncate max-w-50">Reason: {task.reason}</span>}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="min-w-fit font-bold text-sm">
                            <Locale zh="創建於: " en="Created At: " />
                        </span>
                        <span className="text-sm">{createdAt.toLocaleString()}</span>
                    </div>
                </div>

                <Button
                    className="ml-auto"
                    variant="destructive"
                    onClick={() => setConfirmOpen(true)}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending && <Spinner size="sm" />}
                    <Locale zh="刪除" en="Delete" />
                </Button>
            </div>
            <div className="w-full md:w-fit">
                <Button variant="secondary" className="w-full px-2.5" asChild>
                    <Link to={configUrl}>
                        <Locale zh={isReadOnly ? "查看詳情" : "修改選項"} en={isReadOnly ? "View Details" : "Modify Options"} />
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
