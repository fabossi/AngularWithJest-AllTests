import { calculateInvestmentResults, formatter } from "../util/investment"

export default function Results({ input }) {
    const resultsData = calculateInvestmentResults(input);
    const initialInvestment = resultsData[0].valueEndOfYear - resultsData[0].interest - resultsData[0].annualInvestment;
    return <table id="result">
        <thead>
            <tr>
                <th>Year</th>
                <th>Investment value</th>
                <th>Interest</th>
                <th>Total</th>
                <th>Investment Captal</th>
            </tr>
        </thead>
        <tbody>
            {resultsData.map(year => {

                const totalInterestValue = year.valueEndOfYear
                    - year.annualInvestment * year.year - initialInvestment;
                const totalAmountInvested = year.valueEndOfYear - totalInterestValue;

                return <tr key={year}>
                    <td>{year.year}</td>
                    <td>{formatter.format(year.valueEndOfYear)}</td>
                    <td>{formatter.format(year.interest)}</td>
                    <td>{formatter.format(totalInterestValue)}</td>
                    <td>{formatter.format(totalAmountInvested)}</td>
                </tr>
            })}
        </tbody>
    </table>
}