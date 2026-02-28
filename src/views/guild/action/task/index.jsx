import React, {useContext, useMemo} from "react";

import {SimpleGrid, Stack, Text} from "@mantine/core";

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
            zh="返回動作"
            en="Back to Action"
            ariaLabel="Back to Action"
        />,
    ])

    usePageInfo(
        [{zh: "動作", en: "Action"}, actionName].map(locale)
    )

    return <Stack mt={10} gap={5}>
        <Text fontSize={25} fontWeight="bold">
            <Locale zh="修改任務" en="Modify Task" />
        </Text>

        <TaskConfigPanel />
    </Stack>
}

function TaskConfigPanel() {
    const query = useTaskDetailQuery()

    if (query.isLoading) return <ConfigGridSkeleton />
    if (query.error || !query.data) return <Text c="red.4">Failed to load task details.</Text>
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
        <SimpleGrid cols={{base: 1, lg: 2}} spacing={5}>
            <ConfigPanel
                savedName={name}
                values={values}
                onSaved={onSaved}
            />
        </SimpleGrid>
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
        name: <Locale zh="任務名稱" en="Task Name" />,
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