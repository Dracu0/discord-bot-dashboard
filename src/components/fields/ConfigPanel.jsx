import React, { createContext, useCallback, useContext, useState } from "react";
import { OptionPanel } from "./OptionPanel";
import { SaveAlert } from "components/alert/SaveAlert";
import ErrorModal from "../modal/ErrorModal";
import { useMutation } from "@tanstack/react-query";
import { Flex, SimpleGrid, Skeleton, Transition } from "@mantine/core";
import logger from "utils/logger";

const ConfigValuesContext = createContext(null);

/**
 * Hook for custom option renderers to read the current value of any sibling option,
 * reflecting in-progress changes.
 */
export function useConfigValue(id) {
    const ctx = useContext(ConfigValuesContext);
    if (!ctx) return undefined;
    return ctx.getValue(id);
}

function runValidation(option, value) {
    if (option.validate) {
        return option.validate(value) || null;
    }
    if (option.required && (value == null || value === "" || (Array.isArray(value) && value.length === 0))) {
        return `${option.name} is required`;
    }
    return null;
}

function useConfigSaveState(save, onSaved, getInitialState) {
    const [changes, setChanges] = useState(getInitialState)
    const [errors, setErrors] = useState(() => new Map())

    const mutation = useMutation({
        mutationFn: save,
        onSuccess(data) {
            logger.info('config_saved', { fields: [...(data instanceof Map ? data.keys() : Object.keys(data || {}))] })
            setChanges(getInitialState())
            setErrors(new Map())
            return onSaved && onSaved(data)
        },
        onError(error) {
            logger.error('config_save_failed', { error: error.message })
        }
    })

    return { changes, setChanges, errors, setErrors, mutation }
}

export function ConfigItemListAnimated({ options, changes, errors, onChange }) {
    return options.map((option) => (
        <Transition key={option.id} mounted={true} transition="slide-up" duration={200}>
            {(styles) => (
                <Flex w="100%" h="100%" style={styles}>
                    <OptionPanel
                        option={option}
                        value={
                            changes && changes.has(option.id) ? changes.get(option.id) : option.value
                        }
                        error={errors && errors.get(option.id)}
                        onChange={(v) => onChange(option.id, v)}
                    />
                </Flex>
            )}
        </Transition>
    ))
}

export function ConfigGridSkeleton() {
    return <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={5} mt={{ base: 5, md: 10 }}>
        <Skeleton height="20rem" radius="lg" />
        <Skeleton height="20rem" radius="lg" />
        <Skeleton height="20rem" radius="lg" />
        <Skeleton height="20rem" radius="lg" />
    </SimpleGrid>
}

export function ConfigGrid(props) {
    return <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={5} mt={{ base: 5, md: 10 }}>
        <ConfigPanel {...props} />
    </SimpleGrid>
}

export function MultiConfigPanel({ groups, onSave: save, onSaved }) {
    function getInitial() {
        return groups.map(() => new Map())
    }

    const { changes, setChanges, errors, setErrors, mutation } = useConfigSaveState(save, onSaved, getInitial)

    const onChange = (i, id, value) => {
        if (mutation.isPending) return;

        const clone = [...changes]
        clone[i].set(id, value)
        setChanges(clone)

        const option = groups[i]?.find(o => o.id === id);
        if (option) {
            const err = runValidation(option, value);
            const errClone = new Map(errors);
            if (err) errClone.set(id, err); else errClone.delete(id);
            setErrors(errClone);
        }
    }

    const hasErrors = errors.size > 0;

    return (
        <>
            <ErrorModal
                header="Failed to save changes"
                error={mutation.error && mutation.error.toString()}
                onClose={mutation.reset}
            />
            {
                groups.map((options, i) =>
                    <ConfigItemListAnimated
                        key={i}
                        options={options}
                        changes={changes[i]}
                        errors={errors}
                        onChange={(id, value) => onChange(i, id, value)}
                    />
                )
            }
            <SaveAlert
                visible={changes.some(item => item.size > 0)}
                saving={mutation.isPending}
                disabled={hasErrors}
                onSave={() => mutation.mutate(changes)}
                onDiscard={() => { setChanges(getInitial()); setErrors(new Map()); }}
            />
        </>
    );
}

export function ConfigPanel({ options, onDiscard, onSave: save, onSaved }) {
    const { changes, setChanges, errors, setErrors, mutation } = useConfigSaveState(save, onSaved, () => new Map())

    const onChange = (id, value) => {
        if (mutation.isPending) return;

        setChanges(new Map(
            changes.set(id, value)
        ))

        const option = options.find(o => o.id === id);
        if (option) {
            const err = runValidation(option, value);
            const errClone = new Map(errors);
            if (err) errClone.set(id, err); else errClone.delete(id);
            setErrors(errClone);
        }
    };

    const hasErrors = errors.size > 0;

    const getValue = useCallback((id) => {
        if (changes.has(id)) return changes.get(id);
        const opt = options.find(o => o.id === id);
        return opt?.value;
    }, [changes, options]);

    return (
        <ConfigValuesContext.Provider value={{ getValue }}>
            <ErrorModal
                header="Failed to save changes"
                error={mutation.error && mutation.error.toString()}
                onClose={mutation.reset}
            />
            <ConfigItemListAnimated
                options={options}
                changes={changes}
                errors={errors}
                onChange={onChange}
            />
            <SaveAlert
                visible={changes.size !== 0}
                saving={mutation.isPending}
                disabled={hasErrors}
                onSave={() => mutation.mutate(changes)}
                onDiscard={() => {
                    setChanges(new Map())
                    setErrors(new Map())

                    if (onDiscard != null) {
                        onDiscard()
                    }
                }}
            />
        </ConfigValuesContext.Provider>
    );
}