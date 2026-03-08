import React, {useContext, useMemo, useState} from "react";

import {usePageInfo} from "contexts/PageInfoContext";
import {config} from "config/config";
import {useBanner} from "./components/Banner";
import {useActionInfo} from "contexts/actions/ActionDetailContext";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ErrorModal from "components/modal/ErrorModal";
import {SubmitAlert} from "components/alert/SaveAlert";
import {ConfigItemListAnimated} from "components/fields/ConfigPanel";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {addTask} from "api/internal";
import NameInput from "../components/NameInput";
import {usePageState} from "utils/State";
import {Locale, useLocale} from "utils/Language";
import PageSection from "components/layout/PageSection";
import {GuildContext} from "contexts/guild/GuildContext";

export default function SubmitTaskBoard() {
    const {action} = useParams();
    const {id: guild} = useContext(GuildContext);
    const info = useActionInfo();

    if (info?.readOnly) {
        return <Navigate to={`/guild/${guild}/actions/${action}`} replace />;
    }

    return <SubmitTaskContent />
}

function SubmitTaskContent() {
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

    return <PageSection
        title={<Locale zh="\u5275\u5efa\u65b0\u4efb\u52d9" en="New Task" />}
        description={<Locale zh="\u5efa\u7acb\u4e00\u500b\u65b0\u7684\u52d5\u4f5c\u4efb\u52d9\uff0c\u4e26\u5728\u5efa\u7acb\u524d\u5148\u586b\u5beb\u521d\u59cb\u8a2d\u5b9a\u3002" en="Create a new task for this action and configure its initial settings before saving." />}
        className="rounded-[28px] border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) md:p-6"
    >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ConfigPanel />
        </div>
    </PageSection>
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
