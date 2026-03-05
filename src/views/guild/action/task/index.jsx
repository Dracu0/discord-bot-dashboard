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

export default function TaskBoard() {
    const {action: actionId} = useParams()
    const {id: guild} = useContext(GuildContext)
    const actionUrl = `/guild/${guild}/actions/${actionId}`
    const {name: actionName} = useActionInfo()
    const locale = useLocale()
    useActionBanner([
        <BackNavButton
            to={actionUrl}
            zh="\u8fd4\u56de\u52d5\u4f5c"
            en="Back to Action"
            ariaLabel="Back to Action"
        />,
    ])

    usePageInfo(
        [{zh: "\u52d5\u4f5c", en: "Action"}, actionName].map(locale)
    )

    return <div className="flex flex-col mt-2.5 gap-1.5">
        <span className="text-[25px] font-bold">
            <Locale zh="\u4fee\u6539\u4efb\u52d9" en="Modify Task" />
        </span>

        <TaskConfigPanel />
    </div>
}

function TaskConfigPanel() {
    const query = useTaskDetailQuery()

    if (query.isLoading) return <ConfigGridSkeleton />
    if (query.error || !query.data) return <span className="text-red-400">Failed to load task details.</span>
    return <Config detail={query.data} />
}

export function Config({detail}) {
    const {id: guild, action, task} = useParams()

    const {name, values} = detail
    const client = useQueryClient()

    const onSaved = data => {
        client.invalidateQueries(["action_detail", guild, action])
        return client.setQueryData(["task_detail", guild, action, task], data)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
            <ConfigPanel
                savedName={name}
                values={values}
                onSaved={onSaved}
            />
        </div>
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
