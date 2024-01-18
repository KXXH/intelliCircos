import { z } from 'zod'

export const hexColorSchema = z.string().refine((value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value), {
  // 自定义错误消息
  message: 'Invalid HEX color format',
})
