let draw = false;

$(document).ready(function () {
  d3.text(
    "https://raw.githubusercontent.com/sunmoonStern/funin-open-data/main/hospital-data.tsv"
  )
    .then(d3.tsvParseRows)
    .then(tabulate)
    .then(readyUpdate)
    .then(reloadCharts);
});

function readyUpdate() {
  const table = $("#data").DataTable({
    language: {
      infoPostFix:
        '<br><a href="https://github.com/sunmoonStern/funin-open-data-website3">GitHub</a>'
    }
  });

  table.on("page", () => {
    draw = true;
  });

  table.on("draw", () => {
    if (draw) {
      draw = false;
    } else {
      reloadCharts();
    }
  });
}

function reloadCharts() {
  // this contains names of clinics
  const hospitalNames = getHospitalNames();

  const etCount = getEtCount(); //getDataAll(); // getEtCount();
  const pregCount = getPregCount();
  const birthRate = getBirthRate();
  updateCharts(hospitalNames, etCount, pregCount, birthRate);
}

function getHospitalNames() {
  var names = [];
  var api = $("#data").dataTable().api();

  let rows = api.rows({ search: "applied" }).data().toArray();

  rows.forEach(function (row) {
    names.push(row[0]);
  });
  return names;
}

function getEtCount() {
  var stats = [];
  var api = $("#data").dataTable().api();

  let rows = api.rows({ search: "applied" }).data().toArray();

  rows.forEach(function (row) {
    stats.push(parseInt(row[1]));
  });
  return stats;
}

function getPregCount() {
  var stats = [];
  var api = $("#data").dataTable().api();

  let rows = api.rows({ search: "applied" }).data().toArray();

  rows.forEach(function (row) {
    stats.push(parseInt(row[2]));
  });
  return stats;
}

function getBirthRate() {
  var stats = [];
  var api = $("#data").dataTable().api();

  let rows = api.rows({ search: "applied" }).data().toArray();

  rows.forEach(function (row) {
    stats.push(parseFloat(row[3]));
  });
  return stats;
}

function getDataAll() {
  var allDataForHospital = [];
  var api = $("#data").dataTable().api();

  let rows = api.rows({ search: "applied" }).data().toArray();
  rows.forEach(function (row) {
    group = {
      name: "",
      data: []
    };
    row.forEach(function (cell, idx) {
      if (idx == 0) {
        group.name = cell;
      } else if (idx < row.length - 1) {
        group.data.push(parseFloat(cell.replace(/,/g, "")));
      }
    });
    allDataForHospital.push(group);
  });

  return allDataForHospital;
}

function updateCharts(hospitalNames, etCount, pregCount, birthRate) {
  const chart = Highcharts.chart("container", {
    chart: {
      type: "column"
    },
    title: {
      text: "医療機関ごとの治療成績"
    },
    xAxis: {
      categories: hospitalNames,
      crosshair: true
    },
    series: [
      {
        name: "et_count",
        data: etCount
      },
      {
        name: "preg_count",
        data: pregCount
      },
      {
        name: "birth_rate",
        data: birthRate
      }
    ]
  });
}

function tabulate(data) {
  const table = d3.select("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  thead
    .append("tr")
    .selectAll(null)
    .data(data.shift())
    .enter()
    .append("th")
    .text((d) => d);

  const rows = tbody.selectAll(null).data(data).enter().append("tr");

  rows
    .selectAll(null)
    .data((d) => d)
    .enter()
    .append("td")
    .text((d) => d);

  return table;
}