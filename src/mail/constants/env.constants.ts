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
  REPLY_TO_MAIL: isNotEmpty('REPLY_TO_MAIL', process.env.REPLY_TO_MAIL),
  FRONT_URL: isNotEmpty('FRONT_URL', process.env.FRONT_URL),
});
