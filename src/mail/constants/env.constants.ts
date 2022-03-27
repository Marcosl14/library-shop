function isNotEmpty(variableName, variable) {
  if (variable == '') {
    const errorMessage = `EMPTY_${variableName}`;
    throw new Error(errorMessage);
  }
  return variable;
}

export default () => ({
  MAIL_USER: isNotEmpty('MAIL_USER', process.env.MAIL_USER),
  MAIL_PASSWORD: isNotEmpty('MAIL_PASSWORD', process.env.MAIL_PASSWORD),
});
