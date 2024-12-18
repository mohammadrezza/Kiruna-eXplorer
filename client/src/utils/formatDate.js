export const showDate = (issuanceDate) => {
  const [dd, mm, yyyy] = issuanceDate.split('-');
  let realDate = '';
  realDate = realDate.concat(
    dd !== '00' ? `${dd}-` : '',
    mm !== '00' ? `${mm}-` : '',
    yyyy
  );
  return realDate;
};
