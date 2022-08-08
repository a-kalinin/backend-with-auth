export type SuccessResponseT<Type> = { content: Type };

export function wrapSuccessResponse<Type>(model: Type): SuccessResponseT<Type> {
  return {
    content: model,
  };
}

export type ActionResponseT<Details> = {
  content: {
    status: 'ok',
    details?: Details,
  }
};

export function wrapSuccessActionResponse<Details>(
  details?: Details,
): ActionResponseT<Details> {
  return {
    content: {
      status: 'ok',
      details,
    },
  };
}
