import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuildContext } from "contexts/guild/GuildContext";
import { createFeatureItem, updateFeatureItem, deleteFeatureItem } from "api/internal";
import { Button } from "components/ui/button";
import Card from "components/card/Card";
import { Switch } from "components/ui/switch";
import { InputField } from "./impl/InputField";
import TextArea from "./TextArea";
import IdSelectField from "./impl/IdSelectField";
import DurationField from "./impl/DurationField";
import { SelectField } from "./SelectField";
import ErrorModal from "../modal/ErrorModal";
import { toast } from "sonner";

/**
 * Reusable CRUD manager for collection-based features.
 *
 * @param {string}   featureId   - Server-side feature ID (e.g. "custom_commands")
 * @param {Array}    items       - Current items array from feature detail values
 * @param {Array}    columns     - Column defs: [{ key, label, render? }]
 * @param {Array}    formFields  - Field defs: [{ id, label, type, required?, choices?, duration?, validate?, placeholder? }]
 * @param {string}   itemLabel   - Display name ("Custom Command")
 * @param {Function} [transformSubmit] - Optional transform before POST/PATCH
 */
export default function ItemManager({ featureId, items, columns, formFields, itemLabel, transformSubmit }) {
    const { id: serverId } = useContext(GuildContext);
    const queryClient = useQueryClient();
    const [mode, setMode] = useState("list"); // "list" | "add" | "edit"
    const [editItem, setEditItem] = useState(null);
    const [error, setError] = useState(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["feature_detail", serverId, featureId] });

    const createMut = useMutation({
        mutationFn: (data) => createFeatureItem(serverId, featureId, transformSubmit ? transformSubmit(data) : data),
        onSuccess: () => { invalidate(); setMode("list"); toast.success(`${itemLabel} created`); },
        onError: (err) => { setError(err?.message || "Failed to create"); toast.error(`Failed to create ${itemLabel.toLowerCase()}`); },
    });

    const updateMut = useMutation({
        mutationFn: ({ itemId, data }) => updateFeatureItem(serverId, featureId, itemId, transformSubmit ? transformSubmit(data) : data),
        onSuccess: () => { invalidate(); setMode("list"); toast.success(`${itemLabel} updated`); },
        onError: (err) => { setError(err?.message || "Failed to update"); toast.error(`Failed to update ${itemLabel.toLowerCase()}`); },
    });

    const deleteMut = useMutation({
        mutationFn: (itemId) => deleteFeatureItem(serverId, featureId, itemId),
        onSuccess: () => { invalidate(); toast.success(`${itemLabel} deleted`); },
        onError: (err) => { setError(err?.message || "Failed to delete"); toast.error(`Failed to delete ${itemLabel.toLowerCase()}`); },
    });

    if (mode === "add" || mode === "edit") {
        return (
            <>
                <ErrorModal header="Error" error={error} onClose={() => setError(null)} />
                <ItemForm
                    fields={formFields}
                    initialValues={mode === "edit" ? editItem : null}
                    onSubmit={(data) =>
                        mode === "add"
                            ? createMut.mutate(data)
                            : updateMut.mutate({ itemId: editItem._id, data })
                    }
                    onCancel={() => setMode("list")}
                    saving={createMut.isPending || updateMut.isPending}
                    label={itemLabel}
                    isEdit={mode === "edit"}
                />
            </>
        );
    }

    return (
        <>
            <ErrorModal header="Error" error={error} onClose={() => setError(null)} />
            <Card className="rounded-[28px] border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-5 shadow-(--shadow-sm) md:p-6 lg:col-span-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                            Management
                        </p>
                        <p className="font-['Space_Grotesk'] text-xl font-semibold leading-tight text-(--text-primary)">
                            {itemLabel}s
                            <span className="ml-2 text-sm font-normal text-(--text-muted)">({items.length})</span>
                        </p>
                    </div>
                    <Button onClick={() => { setEditItem(null); setMode("add"); }}>
                        + Add {itemLabel}
                    </Button>
                </div>

                {items.length === 0 ? (
                    <p className="py-8 text-center text-sm text-(--text-muted)">
                        No {itemLabel.toLowerCase()}s yet. Click &quot;Add {itemLabel}&quot; to create one.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <ItemRow
                                key={item._id}
                                item={item}
                                columns={columns}
                                onEdit={() => { setEditItem(item); setMode("edit"); }}
                                onDelete={() => {
                                    if (window.confirm(`Delete this ${itemLabel.toLowerCase()}?`)) {
                                        deleteMut.mutate(item._id);
                                    }
                                }}
                                deleting={deleteMut.isPending}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </>
    );
}

function ItemRow({ item, columns, onEdit, onDelete, deleting }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-(--border-subtle) bg-(--surface-primary) px-4 py-3 transition-colors hover:bg-(--surface-secondary)">
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {columns.map((col) => (
                        <div key={col.key} className="min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-(--text-muted)">
                                {col.label}
                            </span>
                            <p className="truncate text-sm text-(--text-primary)" title={String(col.render ? col.render(item[col.key], item) : item[col.key] ?? "")}>
                                {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "—")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleting}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

function ItemForm({ fields, initialValues, onSubmit, onCancel, saving, label, isEdit }) {
    const [values, setValues] = useState(() => {
        const init = {};
        for (const f of fields) {
            if (initialValues && initialValues[f.id] !== undefined) {
                init[f.id] = initialValues[f.id];
            } else {
                init[f.id] = f.defaultValue ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
            }
        }
        return init;
    });

    const [errors, setErrors] = useState({});

    const setValue = (id, val) => {
        setValues((prev) => ({ ...prev, [id]: val }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleSubmit = () => {
        const newErrors = {};
        for (const f of fields) {
            if (f.type === "custom") continue;
            if (isEdit && f.immutable) continue;
            if (f.required && (values[f.id] === "" || values[f.id] == null)) {
                newErrors[f.id] = `${f.label} is required`;
            }
            if (f.validate) {
                const err = f.validate(values[f.id]);
                if (err) newErrors[f.id] = err;
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Only send changed fields on edit, all fields on create
        const data = {};
        for (const f of fields) {
            if (f.type === "custom") continue;
            if (isEdit && f.immutable) continue;
            data[f.id] = values[f.id];
        }
        onSubmit(data);
    };

    return (
        <Card className="rounded-[28px] border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-5 shadow-(--shadow-sm) md:p-6 lg:col-span-2">
            <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                    {isEdit ? "Edit" : "New"} {label}
                </p>
            </div>

            <div className="space-y-4">
                {fields.map((f) => {
                    if (isEdit && f.immutable && f.hideOnEdit) return null;

                    const disabled = isEdit && f.immutable;

                    return (
                        <div key={f.id} className={disabled ? "opacity-50" : ""}>
                            <label className="mb-1 block text-sm font-medium text-(--text-primary)">
                                {f.label}
                                {f.required && <span className="text-(--status-error)"> *</span>}
                            </label>
                            {f.description && (
                                <p className="mb-2 text-xs text-(--text-muted)">{f.description}</p>
                            )}
                            {f.type === "custom" && typeof f.render === "function" ? (
                                f.render({
                                    field: f,
                                    values,
                                    setValue,
                                    value: values[f.id],
                                    onChange: (v) => setValue(f.id, v),
                                    disabled,
                                })
                            ) : (
                                <FormField
                                    field={f}
                                    value={values[f.id]}
                                    onChange={(v) => setValue(f.id, v)}
                                    disabled={disabled}
                                />
                            )}
                            {errors[f.id] && (
                                <p className="mt-1 text-xs text-(--status-error)">{errors[f.id]}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex gap-3">
                <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? "Saving…" : isEdit ? "Save Changes" : `Create ${label}`}
                </Button>
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancel
                </Button>
            </div>
        </Card>
    );
}

function FormField({ field, value, onChange, disabled }) {
    switch (field.type) {
        case "string":
            return (
                <InputField
                    type="text"
                    value={value ?? ""}
                    placeholder={field.placeholder || ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
            );
        case "long_string":
            return (
                <TextArea
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
            );
        case "number":
            return (
                <InputField
                    type="number"
                    value={value ?? 0}
                    onChange={(e) => onChange(isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                    disabled={disabled}
                />
            );
        case "boolean":
            return (
                <Switch
                    checked={!!value}
                    onCheckedChange={(checked) => onChange(checked)}
                    disabled={disabled}
                />
            );
        case "channel":
            return (
                <IdSelectField
                    value={value ?? ""}
                    onChange={onChange}
                    options={field.choices || []}
                    placeholder={field.placeholder || "Select a channel"}
                    disabled={disabled}
                />
            );
        case "role":
            return (
                <IdSelectField
                    value={value ?? ""}
                    onChange={onChange}
                    options={field.choices || []}
                    placeholder={field.placeholder || "Select a role"}
                    disabled={disabled}
                />
            );
        case "duration":
            return (
                <DurationField
                    value={value ?? 0}
                    onChange={onChange}
                    option={field.duration || { duration: { baseUnit: "milliseconds", units: ["minutes", "hours", "days"], min: 60000, max: 30 * 24 * 60 * 60 * 1000 } }}
                    disabled={disabled}
                />
            );
        case "enum":
            return (
                <SelectField
                    options={(field.choices || []).map((c) =>
                        typeof c === "string" ? { label: c, value: c } : c
                    )}
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        default:
            return (
                <InputField
                    type="text"
                    value={value ?? ""}
                    placeholder={field.placeholder || ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
            );
    }
}
