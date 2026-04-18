import * as React from "react"
import type { FieldError as RHFFieldError } from "react-hook-form"

import { cn } from "@/lib/utils"

function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field"
      className={cn("space-y-1.5", className)}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field-group"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

function FieldSet({
  className,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset
      data-slot="fieldset"
      className={cn("space-y-4 border-0 p-0 m-0", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLLegendElement> & { variant?: "label" }) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        variant === "label"
          ? "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          : "text-base font-semibold",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  errors,
  className,
}: {
  errors: (RHFFieldError | undefined)[]
  className?: string
}) {
  const messages = errors
    .filter(Boolean)
    .map((e) => e!.message)
    .filter(Boolean)

  if (!messages.length) return null

  return (
    <ul className={cn("space-y-1", className)}>
      {messages.map((msg, i) => (
        <li
          key={i}
          data-slot="field-error"
          className="text-[0.8rem] font-medium text-destructive"
        >
          {msg}
        </li>
      ))}
    </ul>
  )
}

export {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
}
