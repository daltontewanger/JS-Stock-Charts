// Specifies colors for the stocks in the chart
function getColor(stock) {
  if (stock === "AMZN") {
    return "rgba(61, 161, 61, 0.7)";
  }
  if (stock === "SONY") {
    return "rgba(209, 4, 25, 0.7)";
  }
  if (stock === "DIS") {
    return "rgba(18, 4, 209, 0.7)";
  }
  if (stock === "BNTX") {
    return "rgba(166, 43, 158, 0.7)";
  }
}

async function main() {
  let response = await fetch(
    "https://api.twelvedata.com/time_series?symbol=AMZN,SONY,DIS,BNTX&interval=1day&apikey=bb65f132b1654f74863982595aa828a4"
  );
  let result = await response.json();
  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );

  let { AMZN, SONY, DIS, BNTX } = result;
  let stocks = [AMZN, SONY, DIS, BNTX];
  console.log(result);
  console.log(stocks[0].values);

  stocks.forEach((stock) => stock.values.reverse());
  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        data: stock.values.map((value) => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
  });

  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: stocks.map((stock) => stock.meta.symbol),
      datasets: [
        {
          label: "Highest",
          data: stocks.map((stock) => highestValue(stock.values)),
          backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
          borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
        },
      ],
    },
  });
}

function highestValue(values) {
  let highest = 0;
  values.forEach((value) => {
    if (parseFloat(value.high) > highest) {
      highest = value.high;
    }
  });
  return highest;
}

main();