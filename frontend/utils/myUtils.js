const selctCategory = (category) => {
    switch (category) {
        case "pneus":
            return "pneu";
        case "jantes":
            return "jente";
        case "combos":
            return "Combos";
        default:
            return "mixt";
    }
}
export  {selctCategory};