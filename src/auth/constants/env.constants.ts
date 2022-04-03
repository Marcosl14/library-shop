function isNotEmpty(variableName, variable) {
  if (variable == '') {
    const errorMessage = `EMPTY_${variableName}`;
    throw new Error(errorMessage);
  }
  return variable;
}

export default () => ({
  JWT_SECRET: isNotEmpty('JWT_SECRET', process.env.JWT_SECRET),
});
