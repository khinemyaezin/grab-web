"use client"

import * as React from "react"
import { SearchIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_DEBOUNCE_MS = 300

export type FilterValue = string | boolean

export type FilterValues = Record<string, FilterValue>

export type FilterOption = {
  label: string
  value: string
}

type FilterFieldBase = {
  name: string
  label?: string
  className?: string
  controlClassName?: string
}

export type FilterInputField = FilterFieldBase & {
  type: "input"
  placeholder?: string
  debounceMs?: number
  clearable?: boolean
  icon?: React.ReactNode
}

export type FilterSelectField = FilterFieldBase & {
  type: "select"
  placeholder?: string
  options: FilterOption[]
  groupLabel?: string
}

export type FilterCheckboxField = FilterFieldBase & {
  type: "checkbox"
  checkboxLabel?: string
}

export type FilterField =
  | FilterInputField
  | FilterSelectField
  | FilterCheckboxField

export type FilterProps = {
  fields: FilterField[]
  values?: FilterValues
  defaultValues?: FilterValues
  onChange?: (values: FilterValues) => void
  className?: string
}

function emptyValueFor(field: FilterField): FilterValue {
  return field.type === "checkbox" ? false : ""
}

function buildInitialValues(
  fields: FilterField[],
  seed?: FilterValues
): FilterValues {
  const values: FilterValues = {}
  for (const field of fields) {
    values[field.name] = seed?.[field.name] ?? emptyValueFor(field)
  }
  return values
}

function Filter({
  fields,
  values: controlledValues,
  defaultValues,
  onChange,
  className,
}: FilterProps) {
  const isControlled = controlledValues !== undefined
  const [internalValues, setInternalValues] = React.useState<FilterValues>(() =>
    buildInitialValues(fields, defaultValues)
  )

  const values = isControlled
    ? buildInitialValues(fields, controlledValues)
    : internalValues

  const valuesRef = React.useRef(values)
  valuesRef.current = values

  const handleFieldChange = React.useCallback(
    (name: string, value: FilterValue) => {
      const next = { ...valuesRef.current, [name]: value }
      valuesRef.current = next
      if (!isControlled) {
        setInternalValues(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return (
    <div
      className={cn(className)}
    >
      {fields.map((field) => (
        <FilterFieldControl
          key={field.name}
          field={field}
          value={values[field.name] ?? emptyValueFor(field)}
          onChange={handleFieldChange}
        />
      ))}
    </div>
  )
}

type FilterControlProps<TField extends FilterField> = {
  field: TField
  value: FilterValue
  onChange: (name: string, value: FilterValue) => void
}

function FilterFieldControl({
  field,
  value,
  onChange,
}: FilterControlProps<FilterField>) {
  const controlId = `filter-${field.name}`

  if (field.type === "checkbox") {
    return (
      <Field
        orientation="horizontal"
        className={cn("sm:items-center w-auto", field.className)}
      >
        <Checkbox
          id={controlId}
          className={field.controlClassName}
          checked={Boolean(value)}
          onCheckedChange={(checked) =>
            onChange(field.name, checked === true)
          }
        />
        {(field.checkboxLabel ?? field.label) && (
          <FieldLabel htmlFor={controlId} className="text-sm font-normal">
            {field.checkboxLabel ?? field.label}
          </FieldLabel>
        )}
      </Field>
    )
  }

  return (
    <Field className={cn("gap-1.5 w-auto", field.className)}>
      {field.label && (
        <FieldLabel
          htmlFor={controlId}
          className="text-xs font-medium text-muted-foreground"
        >
          {field.label}
        </FieldLabel>
      )}
      {field.type === "input" ? (
        <FilterInput
          field={field}
          controlId={controlId}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      ) : (
        <FilterSelect
          field={field}
          controlId={controlId}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      )}
    </Field>
  )
}

function FilterInput({
  field,
  controlId,
  value,
  onChange,
}: {
  field: FilterInputField
  controlId: string
  value: string
  onChange: (name: string, value: FilterValue) => void
}) {
  const [text, setText] = React.useState(value)
  const { debounceFn } = useDebounce(
    (next: string) => onChange(field.name, next),
    field.debounceMs ?? DEFAULT_DEBOUNCE_MS
  )

  React.useEffect(() => {
    setText(value)
  }, [value])

  const commit = (next: string) => {
    setText(next)
    debounceFn(next)
  }

  const showClear = (field.clearable ?? true) && text.length > 0
  const icon = field.icon === undefined ? <SearchIcon /> : field.icon

  return (
    <InputGroup className={cn("overflow-hidden", field.controlClassName)}>
      {icon && (
        <InputGroupAddon align="inline-start">
          <span className="text-muted-foreground">{icon}</span>
        </InputGroupAddon>
      )}
      <InputGroupInput
        id={controlId}
        value={text}
        placeholder={field.placeholder}
        onChange={(event) => commit(event.target.value)}
      />
      {showClear && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear"
            title="Clear"
            size="icon-xs"
            onClick={() => commit("")}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

function FilterSelect({
  field,
  controlId,
  value,
  onChange,
}: {
  field: FilterSelectField
  controlId: string
  value: string
  onChange: (name: string, value: FilterValue) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(field.name, next)}
    >
      <SelectTrigger id={controlId} className={cn("w-full", field.controlClassName)}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          {field.groupLabel && <SelectLabel>{field.groupLabel}</SelectLabel>}
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { Filter }
