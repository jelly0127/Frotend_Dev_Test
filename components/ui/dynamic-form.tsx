'use client'

import React from 'react'
import { useForm, Controller, FieldValues, Path, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectOption } from './select'
import { Textarea } from './textarea'
import { Button } from './button'
import { cn } from '@/lib/utils'


export type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local'

// For select and radio types
export interface FieldOption {
  label: string
  value: string | number
}

export interface FieldConfig {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  options?: FieldOption[] // Options for select and radio types
  validation?: z.ZodType<unknown> // Custom validation rules
  defaultValue?: unknown
  description?: string
}

export interface FormConfig {
  fields: FieldConfig[]
  submitButtonText?: string
  submitButtonClassName?: string
  formClassName?: string
  onSubmit: (data: FieldValues) => void | Promise<void>
  onError?: (errors: Record<string, unknown>) => void
}

//  Zod schema
const generateZodSchema = (fields: FieldConfig[]) => {
  const schemaObject: Record<string, z.ZodType<unknown>> = {}

  fields.forEach((field) => {
    let fieldSchema: z.ZodType<unknown>

    // Use custom validation rules if provided
    if (field.validation) {
      fieldSchema = field.validation
    } else {
      // Generate default validation rules based on field type
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Please enter a valid email address')
          break
        case 'number':
          fieldSchema = z.coerce.number().min(0, 'Please enter a valid number')
          break
        case 'tel':
          fieldSchema = z.string().regex(/^1[3-9]\d{9}$/, 'Please enter a valid phone number')
          break
        case 'url':
          fieldSchema = z.string().url('Please enter a valid URL')
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'date':
        case 'time':
        case 'datetime-local':
          fieldSchema = z.string().min(1, 'Please select date/time')
          break
        default:
          fieldSchema = z.string().min(1, 'This field cannot be empty')
      }
    }

    // Set as optional if field is not required
    if (!field.required) {
      fieldSchema = fieldSchema.optional()
    }

    schemaObject[field.name] = fieldSchema
  })

  return z.object(schemaObject)
}

interface FieldRendererProps {
  field: FieldConfig
  control: Control<FieldValues>
  error?: string
}

function FieldRenderer({ field, control, error }: FieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'select':
        return (
          <Controller
            name={field.name as Path<FieldValues>}
            control={control}
            defaultValue={field.defaultValue || ''}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                disabled={field.disabled}
                className={cn('w-full', field.className)}
              >
                <SelectOption value="">Please select...</SelectOption>
                {field.options?.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        )

      case 'textarea':
        return (
          <Controller
            name={field.name as Path<FieldValues>}
            control={control}
            defaultValue={field.defaultValue || ''}
            render={({ field: controllerField }) => (
              <Textarea
                {...controllerField}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn('w-full', field.className)}
              />
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.name as Path<FieldValues>}
            control={control}
            defaultValue={field.defaultValue || false}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...controllerField}
                  checked={controllerField.value}
                  disabled={field.disabled}
                  className="h-4 w-4 rounded border border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                <Label className="text-sm font-normal">{field.label}</Label>
              </div>
            )}
          />
        )

      case 'radio':
        return (
          <Controller
            name={field.name as Path<FieldValues>}
            control={control}
            defaultValue={field.defaultValue || ''}
            render={({ field: controllerField }) => (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...controllerField}
                      value={option.value}
                      checked={controllerField.value === option.value}
                      disabled={field.disabled}
                      className="h-4 w-4 border border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <Label className="text-sm font-normal">{option.label}</Label>
                  </div>
                ))}
              </div>
            )}
          />
        )

      default:
        return (
          <Controller
            name={field.name as Path<FieldValues>}
            control={control}
            defaultValue={field.defaultValue || ''}
            render={({ field: controllerField }) => (
              <Input
                type={field.type}
                {...controllerField}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn('w-full', field.className)}
              />
            )}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {field.description && (
        <p className="text-sm text-gray-400">{field.description}</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

// Main dynamic form component
export function DynamicForm({
  fields,
  submitButtonText = 'Submit',
  submitButtonClassName,
  formClassName,
  onSubmit,
  onError
}: FormConfig) {
  const schema = generateZodSchema(fields)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  const handleFormSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data)
    } catch (error) {
      onError?.(error as Record<string, unknown>)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('space-y-6', formClassName)}
    >
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          control={control}
          error={errors[field.name]?.message as string}
        />
      ))}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn('flex-1', submitButtonClassName)}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </form>
  )
}

export default DynamicForm 