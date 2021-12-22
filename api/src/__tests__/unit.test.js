const {
    isFestivalRequestValid,
    isSignUpRequestValid
} = require('../routes');

test('check if festival req.body is valid', () => {
    const requestBody = {
        name: "Dour",
        date_begin: "2022-07-13",
        date_end: "2022-07-17",
        description: "Dour is een vijfdaags muziekfestival dat zichzelf de naam van 'European Alternative Music Event' geeft.",
    };

    expect(isFestivalRequestValid(requestBody)).toBeTruthy();
    expect(isFestivalRequestValid({})).toBeFalsy();

    // A name must contain at least 2 and maximum 30 characters. 
    // Punctuation and numbers are not allowed.
    expect(isFestivalRequestValid({...requestBody, name: "D0ur"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, name: "Deze naam is meer dan dertig karakters"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, name: "D"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, name: "Dour."})).toBeFalsy();
    
    // A date must follow the format 'yyyy-mm-dd'.
    // The month has to be between 01 and 12, the day between 01 and 31.
    // date_begin & date_end undergo the same validation.
    expect(isFestivalRequestValid({...requestBody, date_begin: "07-13-2022"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, date_begin: "20022-07-13"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, date_begin: "2022-07-35"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, date_begin: "2022-13-07"})).toBeFalsy();

    // The description cannot contain certain special characters, like €, $, @, ~, <> and {}.
    expect(isFestivalRequestValid({...requestBody, description: "Voor slechts €150"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, description: "Mail ons nu op example@example.com"})).toBeFalsy();
    expect(isFestivalRequestValid({...requestBody, description: "<p>Dit is een paragraaf<p>"})).toBeFalsy();
});

test('check if signup req.body is valid', () => {
    const requestBody = {
        username: "Lorenz Reweghs",
        email: "lorenz@student.be",
        password: "Lorenz123",
        date_birth: "1999-03-02",
    };

    expect(isSignUpRequestValid(requestBody)).toBeTruthy();
    expect(isSignUpRequestValid({})).toBeFalsy();

    // A name must contain at least 3 and maximum 25 characters.
    // Special characters are not allowed.
    expect(isSignUpRequestValid({...requestBody, username: "Lr"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, username: "LorenzReweghs9876412657813"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, username: "Lorenz&%Reweghs"})).toBeFalsy();

    // An email must contain an @ symbol, but no other special characters.
    expect(isSignUpRequestValid({...requestBody, email: "lorenz#reweghs@student.be"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, email: "lorenz.student.be"})).toBeFalsy();

    // A password must contain at least 8 characters, with at least one digit, one lower case and one upper case character.
    expect(isSignUpRequestValid({...requestBody, password: "lorenz"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, password: "lorenz123"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, password: "Lorenzzzz"})).toBeFalsy();

    // A date must follow the format 'yyyy-mm-dd'.
    // The month has to be between 01 and 12, the day between 01 and 31.
    expect(isSignUpRequestValid({...requestBody, date_birth: "07-13-2022"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, date_birth: "20022-07-13"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, date_birth: "2022-07-35"})).toBeFalsy();
    expect(isSignUpRequestValid({...requestBody, date_birth: "2022-13-07"})).toBeFalsy();
});