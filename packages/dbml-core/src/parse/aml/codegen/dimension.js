export function convertDimensionToDbmlRawField (dimension) {
  const field = {
    name: dimension.name,
    type: {
      schemaName: null,
      type_name: dimension.type,
      args: null,
    },
    token: null,
    inline_refs: [],
    pk: false,

  };
  return field;
}
