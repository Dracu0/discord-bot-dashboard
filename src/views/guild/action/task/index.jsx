import React, {useContext, useMemo} from "react";

import {usePageInfo} from "contexts/PageInfoContext";
import {useActionInfo} from "contexts/actions/ActionDetailContext";
import {ConfigGridSkeleton, MultiConfigPanel} from "components/fields/ConfigPanel";
import {useParams} from "react-router-dom";
import {updateTask} from "api/internal";
import {GuildContext} from "contexts/guild/GuildContext";
import {useActionBanner} from "../components/ActionBanner";
import {useTaskDetailQuery} from "../../../../contexts/actions/TaskDetailContext";
import {useQueryClient} from "@tanstack/react-query";
import {usePageState} from "../../../../utils/State";
import {Locale, useLocale} from "../../../../utils/Language";
import BackNavButton from "components/navigation/BackNavButton";
import PageSection from "components/layout/PageSection";
import {ConfigItemListAnimated} from "components/fields/ConfigPanel";

export default function TaskBoard() {
    const {action: actionId} = useParams()
    const {id: guild} = useContext(GuildContext)
    const actionUrl = `/guild/${guild}/actions/${actionId}`
    const info = useActionInfo()
    const locale = useLocale()
    const isReadOnly = info?.readOnly === true
    useActionBanner([
        <BackNavButton
            to={actionUrl}
            zh="\u8fd4\u56de\u52d5\u4f5c"
            en="Back to Action"
            ariaLabel="Back to Action"
        />,
    ])

    usePageInfo(
        [{zh: "\u52d5\u4f5c", en: "Action"}, info?.name].map(locale)
    )

    return <PageSection
        title={<Locale zh={isReadOnly ? "\u8a73\u60c5" : "\u4fee\u6539\u4efb\u52d9"} en={isReadOnly ? "Entry Details" : "Modify Task"} />}
        description={<Locale
            zh={isReadOnly ? "\u6aa2\u8996\u6b64\u6a21\u7d44\u65e5\u8a8c\u689d\u76ee\u7684\u8a73\u7d30\u8cc7\u8a0a\u3002" : "\u66f4\u65b0\u6b64\u4efb\u52d9\u7684\u540d\u7a31\u8207\u8a2d\u5b9a\uff0c\u8b8a\u66f4\u6703\u5728\u5132\u5b58\u5f8c\u540c\u6b65\u5230\u4f3a\u670d\u5668\u3002"}
            en={isReadOnly
                ? "View the details of this moderation log entry. Only the reason field can be edited."
                : "Update the task name and settings here; changes will sync back to the server when saved."
            }
        />}
        className="rounded-[28px] border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) md:p-6"
    >
        <TaskConfigPanel />
    </PageSection>
}

function TaskConfigPanel() {
    const query = useTaskDetailQuery()

    if (query.isLoading) return <ConfigGridSkeleton />
    if (query.error || !query.data) return <span className="text-red-400">Failed to load task details.</span>
    return <Config detail={query.data} />
}

export function Config({detail}) {
    const {id: guild, action, task} = useParams()
    const info = useActionInfo()
    const isReadOnly = info?.readOnly === true

    const {name, values} = detail
    const client = useQueryClient()

    const onSaved = data => {
        client.invalidateQueries(["action_detail", guild, action])
        return client.setQueryData(["task_detail", guild, action, task], data)
    }

    if (isReadOnly) {
        return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ReadOnlyConfigPanel
                    savedName={name}
                    values={values}
                    onSaved={onSaved}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ConfigPanel
                savedName={name}
                values={values}
                onSaved={onSaved}
            />
        </div>
    );
}

function ReadOnlyConfigPanel({savedName, onSaved, values}) {
    const {id: guild, action, task} = useParams();
    const info = useActionInfo()
    const state = usePageState()

    const allOptions = useMemo(
        () => info.options(values, state),
        [values]
    )

    const readOnlyOptions = allOptions.filter(o => o.readOnly)
    const editableOptions = allOptions.filter(o => !o.readOnly)

    const onSave = ([changes]) => {
        return updateTask(guild, action, task, savedName, changes)
    }

    return (
        <>
            {readOnlyOptions.length > 0 && (
                <ConfigItemListAnimated
                    options={readOnlyOptions}
                    changes={new Map()}
                    onChange={() => {}}
                />
            )}
            {editableOptions.length > 0 && (
                <MultiConfigPanel
                    groups={[editableOptions]}
                    onSave={onSave}
                    onSaved={onSaved}
                />
            )}
        </>
    );
}

function ConfigPanel({savedName, onSaved, values}) {
    const {id: guild, action, task} = useParams();
    const info = useActionInfo()
    const state = usePageState()

    const options = useMemo(
        () => info.options(values, state),
        [values]
    )

    const onSave = ([nameChanges, changes]) => {
        return updateTask(guild, action, task, nameChanges.get("name"), changes)
    }

    const nameOption = {
        id: "name",
        type: "string",
        name: <Locale zh="\u4efb\u52d9\u540d\u7a31" en="Task Name" />,
        value: savedName,
        required: true
    }

    return (
        <MultiConfigPanel
            groups={[
                [nameOption], options
            ]}
            onSave={onSave}
            onSaved={onSaved}
        />
    );
}
