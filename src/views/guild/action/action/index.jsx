import React, { useContext } from "react";

import { Box, Center, Flex, SimpleGrid, Stack, Text, Transition } from "@mantine/core";

import { usePageInfo } from "contexts/PageInfoContext";
import { ActionDetailContext, ActionDetailProvider, useActionInfo } from "contexts/actions/ActionDetailContext";
import { useBanner } from "./components/Banner";
import NotFound from "../../../info/Not_Found";
import SearchInput from "components/fields/impl/SearchInput";

import not_found from "assets/img/info/not_found.svg";
import CreateButton from "./components/CreateButton";
import { Locale, useLocale } from "../../../../utils/Language";
import { Task } from "../components/Task";
import { useTextFilter } from "hooks/useTextFilter";

import { useParams } from "react-router-dom";
export default function ActionTasks() {
    const info = useActionInfo()
    const {action} = useParams()

    if (info == null) {
        return <NotFound />
    }

    return <TasksPanel key={action} />
}

function TasksPanel() {
    useBanner()
    const {query: filter, setQuery: setFilter, includes} = useTextFilter("")
    const {name} = useActionInfo()
    const locale = useLocale()

    usePageInfo([
        {zh: "動作", en: "Action"},
        name
    ].map(locale))

    return <Flex direction="column" gap={5} pt={10} px={{ base: 1, md: 3, lg: 10 }}>
        <Center style={{ flexDirection: "column", gap: 20 }} mb={5}>
            <Text fz={24} fw="bold">
                <Locale zh="運行中" en="Tasks" />
            </Text>

            <SearchInput value={filter} onChange={setFilter} bg="var(--surface-secondary)" groupStyle={{ maw: "20rem" }} />
        </Center>
        <ActionDetailProvider>
            <TasksContent includes={includes} />
        </ActionDetailProvider>
    </Flex>
}

function TasksContent({includes}) {
    const {tasks} = useContext(ActionDetailContext)

    return tasks.length === 0 ? (
        <Box style={{ backgroundImage: `url(${not_found})`, backgroundSize: "cover" }} h="50vh">
            <Stack w="100%" h="100%" style={{ backdropFilter: "blur(50px)" }}>
                <Text ta="center" fz={22} fw="bold" mt={10}>
                    <Locale zh="沒有任務正在運行" en="No Tasks running" />
                </Text>
                <CreateButton />
            </Stack>
        </Box>
    ) : (
        <Transition mounted={true} transition="slide-up" duration={300}>
            {(styles) => (
                <div style={styles}>
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={5}>
                        {tasks
                            .filter((task) => includes(task.name))
                            .map((task) => (
                                <Task key={task.id} task={task} />
                            ))}
                    </SimpleGrid>
                </div>
            )}
        </Transition>
    );
}