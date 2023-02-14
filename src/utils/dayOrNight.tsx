
const dayOrNight = (hourInStringFormat: string) => {
    if (Number(hourInStringFormat) === 12) {
        return "12PM"
    } else if (Number(hourInStringFormat) > 12) { 
        return (Number(hourInStringFormat) - 12).toString() + "PM"
    } else {
        return Number(hourInStringFormat).toString() + "AM"
    }
}

export default dayOrNight