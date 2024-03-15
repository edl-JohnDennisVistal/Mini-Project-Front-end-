export class Commons {
    /* For validation of special characters. */
    noSpecialChars(control: any): {[s: string]: boolean} {
        const specialChars = /[\\!@#$%^&/=*(),-."[{}|<>]/;
        const hasSpecialChars = specialChars.test(control.value);
        return hasSpecialChars ? { 'specialChars': true } : null;
    }

}