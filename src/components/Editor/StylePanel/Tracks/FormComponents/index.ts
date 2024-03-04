import type { FormContext } from 'vee-validate'
import type { InjectionKey } from 'vue'
import type { z } from 'zod'

export enum FormFieldTypes {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  COLOR = 'color',
  SLIDER = 'slider',
}

export const FormInjectKey = Symbol('form') as InjectionKey<FormContext<any, z.output<any>>>
