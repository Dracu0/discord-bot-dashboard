import React, { createContext, useCallback, useContext, useReducer } from "react";
import { OptionPanel } from "./OptionPanel";
import { SaveAlert } from "components/alert/SaveAlert";
import ErrorModal from "../modal/ErrorModal";
import { useMutation } from "@tanstack/react-query";
import { Skeleton } from "components/ui/skeleton";
import { useHotkeys } from "hooks/useHotkeys";
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

// --- Reducer-based state management with undo/redo ---

const MAX_HISTORY = 30;

function configReducer(state, action) {
    switch (action.type) {
        case 'SET_VALUE': {
            const { id, value, options } = action;
            const newChanges = new Map(state.changes);
            newChanges.set(id, value);

            const newErrors = new Map(state.errors);
            const option = options.find(o => o.id === id);
            if (option) {
                const err = runValidation(option, value);
                if (err) newErrors.set(id, err); else newErrors.delete(id);
            }

            // Push current changes to undo history (trim future on new change)
            const pastEntry = new Map(state.changes);
            const newPast = [...state.past, pastEntry].slice(-MAX_HISTORY);

            return { ...state, changes: newChanges, errors: newErrors, past: newPast, future: [] };
        }
        case 'UNDO': {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);
            const newFuture = [new Map(state.changes), ...state.future];
            return { ...state, changes: previous, past: newPast, future: newFuture, errors: new Map() };
        }
        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            const newPast = [...state.past, new Map(state.changes)];
            return { ...state, changes: next, past: newPast, future: newFuture, errors: new Map() };
        }
        case 'RESET': {
            return { changes: action.initial, errors: new Map(), past: [], future: [] };
        }
        default:
            return state;
    }
}

function useConfigSaveState(save, onSaved, getInitialState) {
    const [state, dispatch] = useReducer(configReducer, null, () => ({
        changes: getInitialState(),
        errors: new Map(),
        past: [],
        future: [],
    }));

    const mutation = useMutation({
        mutationFn: save,
        onSuccess(data) {
            logger.info('config_saved', { fields: [...(data instanceof Map ? data.keys() : Object.keys(data || {}))] })
            dispatch({ type: 'RESET', initial: getInitialState() });
            return onSaved && onSaved(data)
        },
        onError(error) {
            logger.error('config_save_failed', { error: error.message })
        }
    })

    return { state, dispatch, mutation }
}

export function ConfigItemListAnimated({ options, changes, errors, onChange }) {
    return (options || []).map((option) => (
        <div key={option.id} className="w-full h-full">
            <OptionPanel
                option={option}
                value={
                    changes && changes.has(option.id) ? changes.get(option.id) : option.value
                }
                error={errors && errors.get(option.id)}
                onChange={(v) => onChange(option.id, v)}
            />
        </div>
    ))
}

export function ConfigGridSkeleton() {
    return (
        <div className="mt-1.5 grid grid-cols-1 gap-5 md:mt-2.5 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
        </div>
    );
}

export function ConfigGrid(props) {
    return (
        <div className="mt-1.5 grid grid-cols-1 gap-5 md:mt-2.5 lg:grid-cols-2">
            <ConfigPanel {...props} />
        </div>
    );
}

export function MultiConfigPanel({ groups, onSave: save, onSaved }) {
    function getInitial() {
        return groups.map(() => new Map())
    }

    const { state, dispatch, mutation } = useConfigSaveState(save, onSaved, getInitial)
    const { changes, errors } = state;

    const onChange = (i, id, value) => {
        if (mutation.isPending) return;

        // For multi-group, flatten into single changes map with group prefix
        const clone = [...changes]
        if (!Array.isArray(clone) || clone.length !== groups.length) return;
        const groupChanges = new Map(clone[i]);
        groupChanges.set(id, value);
        clone[i] = groupChanges;

        const option = groups[i]?.find(o => o.id === id);
        const newErrors = new Map(errors);
        if (option) {
            const err = runValidation(option, value);
            if (err) newErrors.set(id, err); else newErrors.delete(id);
        }

        dispatch({ type: 'RESET', initial: clone });
        // Note: undo/redo not supported for multi-group panels
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
                visible={Array.isArray(changes) && changes.some(item => item instanceof Map && item.size > 0)}
                saving={mutation.isPending}
                disabled={hasErrors}
                onSave={() => mutation.mutate(changes)}
                onDiscard={() => dispatch({ type: 'RESET', initial: getInitial() })}
            />
        </>
    );
}

export function ConfigPanel({ options, onDiscard, onSave: save, onSaved }) {
    const { state, dispatch, mutation } = useConfigSaveState(save, onSaved, () => new Map())
    const { changes, errors, past, future } = state;

    const onChange = (id, value) => {
        if (mutation.isPending) return;
        dispatch({ type: 'SET_VALUE', id, value, options });
    };

    const hasErrors = errors.size > 0;
    const hasChanges = changes.size !== 0;

    useHotkeys([
        ['mod+Z', () => { if (!mutation.isPending) dispatch({ type: 'UNDO' }); }],
        ['mod+shift+Z', () => { if (!mutation.isPending) dispatch({ type: 'REDO' }); }],
        ['mod+S', (e) => {
            e.preventDefault();
            if (hasChanges && !hasErrors && !mutation.isPending) mutation.mutate(changes);
        }],
    ]);

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
                visible={hasChanges}
                saving={mutation.isPending}
                disabled={hasErrors}
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                onUndo={() => dispatch({ type: 'UNDO' })}
                onRedo={() => dispatch({ type: 'REDO' })}
                onSave={() => mutation.mutate(changes)}
                onDiscard={() => {
                    dispatch({ type: 'RESET', initial: new Map() });
                    if (onDiscard != null) {
                        onDiscard()
                    }
                }}
            />
        </ConfigValuesContext.Provider>
    );
}
