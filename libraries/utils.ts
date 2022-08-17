// function to create the math logic behind the timeperiods for stock api calls.

const DaysCalc = () => {
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const adjToday = mm + '/' + dd + '/' + yyyy;
    document.write(adjToday);
}