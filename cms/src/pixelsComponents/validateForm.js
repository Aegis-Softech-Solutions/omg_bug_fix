function validateForm(props) {
  let errors = [];
  let formIsValid = true;

  for (let i = 0; i < props.length; i++) {
    // prettier-ignore
    const { fieldName, fieldValue, checkNotEmpty, checkEmail, checkAlphaOnly, checkNoSpecialChar,
            checkForceAlphaNumeric, checkNumericOnly, checkLength, exactLength, minLength, maxLength }
        = props[i];

    errors[fieldName] = '';

    // Check Value is Not Empty ------- checkNotEmpty
    // Also takes care of: only spaces within a string, image-fields, empty arrays (for multi-select)
    if (
      checkNotEmpty === 'Y' &&
      (!fieldValue ||
        (typeof fieldValue === 'string' && !/\S/.test(fieldValue)) ||
        (typeof fieldValue === 'object' && fieldValue.type && !fieldValue.name) ||
        (typeof fieldValue === 'object' && !fieldValue.type && !fieldValue.length))
    ) {
      formIsValid = false;
      errors[fieldName] = 'Cannot be empty';
      continue;
    }

    // Check Value is in Email Format ------- checkEmail
    if (checkEmail === 'Y' && fieldValue) {
      let lastAtPos = fieldValue.lastIndexOf('@');
      let lastDotPos = fieldValue.lastIndexOf('.');

      if (!/^[a-zA-Z0-9_]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$/.test(fieldValue)) {
        formIsValid = false;
        errors[fieldName] = 'e-mail is not valid';
        continue;
      }

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fieldValue.indexOf('@@') === -1 &&
          fieldValue.indexOf('@-') === -1 &&
          fieldValue.indexOf('-.') === -1 &&
          fieldValue.indexOf('--') === -1 &&
          fieldValue[0] !== '_' &&
          lastDotPos > 2 &&
          fieldValue.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors[fieldName] = 'e-mail is not valid';
        continue;
      }
    }

    // Check Value is Alpahbets Only ------- checkAlphaOnly
    if (checkAlphaOnly === 'Y' && fieldValue) {
      if (/\d/.test(fieldValue)) {
        formIsValid = false;
        errors[fieldName] = 'Only letters allowed';
        continue;
      }
    }

    // Check Value does not have special char ------- checkNoSpecialChar
    if (checkNoSpecialChar === 'Y' && fieldValue) {
      if (!fieldValue.match(/^[0-9a-zA-Z]+$/)) {
        formIsValid = false;
        errors[fieldName] = 'No special characters allowed';
        continue;
      }
    }

    // Check Value has atleast one number and one char ------- checkForceAlphaNumeric
    if (checkForceAlphaNumeric === 'Y' && fieldValue) {
      if (fieldValue.match(/^[0-9a-zA-Z]+$/)) {
        if (!/\d/.test(fieldValue)) {
          formIsValid = false;
          errors[fieldName] = 'Need letters and numbers';
          continue;
        }
      } else {
        formIsValid = false;
        errors[fieldName] = 'Need letters and numbers';
        continue;
      }
    }

    // Check Value is numeric ------- checkNumericOnly
    if (checkNumericOnly === 'Y' && isNaN(fieldValue) && fieldValue) {
      formIsValid = false;
      errors[fieldName] = 'Value should be numeric only';
      continue;
    }

    // Check if Value is of a particular length, or between a range, or greater than a length or shorter than a lengh
    if (checkLength === 'Y' && fieldValue && typeof exactLength !== 'undefined') {
      if (fieldValue.length !== exactLength) {
        formIsValid = false;
        errors[fieldName] = 'Length should be equal to ' + exactLength;
        continue;
      }
    }

    if (checkLength === 'Y' && typeof minLength !== 'undefined' && typeof maxLength !== 'undefined' && fieldValue) {
      if (fieldValue.length < minLength || fieldValue.length > maxLength) {
        formIsValid = false;
        errors[fieldName] = 'Length should be between ' + minLength + ' and ' + maxLength;
        continue;
      }
    }

    if (checkLength === 'Y' && typeof minLength !== 'undefined' && fieldValue) {
      if (fieldValue.length < minLength) {
        formIsValid = false;
        errors[fieldName] = 'Length should be greater than or equal to ' + minLength;
        continue;
      }
    }

    if (checkLength === 'Y' && typeof maxLength !== 'undefined' && fieldValue) {
      if (fieldValue.length > maxLength) {
        formIsValid = false;
        errors[fieldName] = 'Length should be lesser than or equal ' + maxLength;
        continue;
      }
    }
  }

  return { errors, formIsValid };
}

export { validateForm };
