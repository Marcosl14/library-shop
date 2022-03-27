function isNotEmpty(variableName, variable) {
  if (variable == '') {
    const errorMessage = `EMPTY_${variableName}`;
    throw new Error(errorMessage);
  }
  return variable;
}

export default () => ({
  JWT_SECRET: isNotEmpty('JWT_CONTANT', process.env.JWT_CONSTANT),
});
