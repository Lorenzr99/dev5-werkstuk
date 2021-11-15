const {
    isFestivalRequestValid
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