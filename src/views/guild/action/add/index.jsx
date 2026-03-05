import React, {useMemo, useState} from "react";

import {usePageInfo} from "contexts/PageInfoContext";
import {config} from "config/config";
import {useBanner} from "./components/Banner";
import {useActionInfo} from "contexts/actions/ActionDetailContext";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ErrorModal from "components/modal/ErrorModal";
import {SubmitAlert} from "components/alert/SaveAlert";
import {ConfigItemListAnimated} from "components/fields/ConfigPanel";
import {useNavigate, useParams} from "react-router-dom";
import {addTask} from "api/internal";
import NameInput from "../components/NameInput";
import {usePageState} from "utils/State";
import {Locale, useLocale} from "utils/Language";

export default function SubmitTaskBoard() {
    useBanner()

    return <SubmitTask />
}

function SubmitTask() {
    const {name} = useActionInfo()
    const locale = useLocale()

    usePageInfo([
        {zh: "\u52d5\u4f5c", en: "Action"},
        name,
        {zh: "\u65b0\u4efb\u52d9", en: "New Task"}
    ].map(locale))

    return <div className="flex flex-col mt-2.5 gap-1.5">
        <span className="text-[25px] font-bold">
            <Locale zh="\u5275\u5efa\u65b0\u4efb\u52d9" en="New Task" />
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
            <ConfigPanel />
        </div>
    </div>
}

function ConfigPanel() {
    const {id: guild, action} = useParams()
    const navigate = useNavigate()
    const client = useQueryClient()
    const state = usePageState()

    const options = useMemo(
        () => config.actions[action].options(null, state),
        []
    )

    const [name, setName] = useState("New Task")
    const [changes, setChanges] = useState(new Map());

    const mutation = useMutation({
        mutationFn: () => addTask(guild, action, name, changes),
        onSuccess(data) {
            client.setQueryData(
                ["task_detail", guild, action, data.id.toString()],
                data
            )
            client.invalidateQueries({ queryKey: ["action_detail", guild, action] })

            navigate(`/guild/${guild}/actions/${action}/task/${data.id}`)
        }
    })

    const onChange = (id, value) => {
        if (mutation.isPending) return;

        setChanges(new Map(
            changes.set(id, value)
        ))
    };

    return (
        <>
            <ErrorModal
                header={{zh: "\u672a\u80fd\u5275\u5efa\u4efb\u52d9", en: "Failed to Create Task"}}
                error={mutation.error && mutation.error.toString()}
                onClose={mutation.reset}
            />
            <NameInput value={name} onChange={setName} />
            <ConfigItemListAnimated
                options={options}
                changes={changes}
                onChange={onChange}
            />
            <SubmitAlert
                visible={name.length !== 0}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
            />
        </>
    );
}
