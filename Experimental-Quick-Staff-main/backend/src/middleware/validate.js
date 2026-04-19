export const validate = (schema) => async (req, res, next) => {
  try {
    const value = await schema.validateAsync(
      { body: req.body, params: req.params, query: req.query },
      { abortEarly: false, stripUnknown: true }
    );
    req.body = value.body ?? req.body;
    req.params = value.params ?? req.params;
    req.query = value.query ?? req.query;
    return next();
  } catch (err) {
    const details = err?.details?.map((d) => d.message) || [err.message];
    return res.status(400).json({ message: details[0], errors: details });
  }
};

