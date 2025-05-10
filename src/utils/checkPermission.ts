export const hasPermissionToModule = (
  permission: string[],
  module: string
): boolean => {
  return permission.some((p) => p.startsWith(module + "."))
}
