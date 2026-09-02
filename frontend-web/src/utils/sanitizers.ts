const SCRIPT_PATTERN =
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi

export const sanitizeInput = (input: string): string => {
  return input
    .replace(SCRIPT_PATTERN, '')
    .replace(/<[^>]*>/g, '')
    .replace(/(javascript:|on\w+\s*=|data:text\/html)/gi, '')
    .trim()
}

export const sanitizeProduct = (product: {
  name: string
  description: string
}): { name: string; description: string } => ({
  name: sanitizeInput(product.name),
  description: sanitizeInput(product.description),
})