/**
 * Removes all properties with value `undefined` from a DTO.
 *
 * Why:
 * - PATCH requests only update provided fields
 * - undefined means "field not sent"
 * - null is preserved (intentional clearing of a field)
 *
 * Example:
 * input:  { title: "A", rating: undefined }
 * output: { title: "A" }
 */
export function cleanUpdate<T>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto as Record<string, unknown>).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined,
    ),
  ) as Partial<T>;
}
