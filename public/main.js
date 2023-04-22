const tableBody = document.querySelector('#sql-table tbody');
let sqlData;
let outcomes;

const loadData = () => {
  fetch('/api/sql-data')
    .then(response => response.json())
    .then(data => {
      sqlData = data;
      // Render the table header if it doesn't exist
      console.log("Something");
      const tableHeader = document.querySelector('#sql-table thead');
      if (!tableHeader.querySelector('tr')) {
        
        const headerRow = document.createElement('tr');
        data.header.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);
      }

      // Render the table body
      const tableBody = document.querySelector('#sql-table tbody');
      tableBody.innerHTML = '';
      data.data.forEach(row => {
        const tr = document.createElement('tr');
        data.header.forEach(header => {
          const td = document.createElement('td');
          td.textContent = row[header];
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
    })
    .catch(error => console.error(error));
};

const loadFailedCases = () => {
  fetch('/api/sql-data-fail')
    .then(response => response.json())
    .then(data => {
      const tableHeader = document.querySelector('#load-progress thead');
      if (!tableHeader.querySelector('tr')) {
        const headerRow = document.createElement('tr');
        data.header.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);
      }

      const tableBody = document.querySelector('#load-progress tbody');
      tableBody.innerHTML = '';
      data.data.forEach(row => {
        if (row.outcome === 'Failed') {
          const tr = document.createElement('tr');
          data.header.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
          });
          tableBody.appendChild(tr);
        }
      });
    })
    .catch(error => console.error(error));
};

// const loadProgress = () => {
//   let mapClassOutcome = getUniqueClassNames();
//   console.log(mapClassOutcome);
//   const tableHeader = document.querySelector('#load-progress thead');
//   if (!tableHeader.querySelector('tr')) {
//     const headerRow = document.createElement('tr');
//     Object.keys(mapClassOutcome).forEach(headerText => {
//       const th = document.createElement('th');
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });
//     tableHeader.appendChild(headerRow);
//   }

//   const tableBody = document.querySelector('#load-progress tbody');
//   tableBody.innerHTML = '';
//   Object.keys(getUniqueClassName.data).forEach(recordName => {
//     const record =getUniqueClassName.data[recordName];
//     const tr = document.createElement('tr');
//     const tdRecordName = document.createElement('td');
//     tdRecordName.textContent = recordName;
//     tr.appendChild(tdRecordName);
//     Object.keys(record).forEach(columnName => {
//       const tdColumnValue = document.createElement('td');
//       tdColumnValue.textContent = record[columnName];
//       tr.appendChild(tdColumnValue);
//     });
//     tableBody.appendChild(tr);
//   });
// };

function countOutcomes() {
  outcomes = {};
  sqlData.data.forEach((row) => {
    const outcome = row.outcome;
    if (outcomes[outcome]) {
      outcomes[outcome]++;
    } else {
      outcomes[outcome] = 1;
    }
  });
  console.log(outcomes);
  drawChart(outcomes);
}

function getUniqueClassNames() {
  const classNames = {};
  sqlData.data.forEach(row => {
    const className = row.className;
    if (!classNames[className]) {
      classNames[className] = countoutcomes(className);
    }
  });
  return classNames;
}

function countoutcomes(className) {
  const filteredData = sqlData.data.filter(row => row.className === className);
  const outcomes = {};
  filteredData.forEach(row => {
    const outcome = row.outcome;
    if (outcomes[outcome]) {
      outcomes[outcome]++;
    } else {
      outcomes[outcome] = 1;
    }
  });
  return outcomes;
}

function drawChart(data) {
  // Create pie chart
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Outcome "
    },
    legend: {
      verticalAlign: "center",
      horizontalAlign: "left",
      fontSize: 16,
      fontFamily: "Helvetica"
    },
    data: [{
      type: "doughnut",
      innerRadius: "70%", // set inner radius as 40% of chart radius
      startAngle: 240,
      showInLegend: true,
      legendText: "{label}",
      indexLabel: "{label} {y}",
      dataPoints: Object.keys(data).map(key => ({ label: key, y: data[key] }))
    }]
  });
  
  // Render chart
  chart.render();
}

function displayProgressBars() {
    const outcomeByClassName = getUniqueClassNames();
    console.log(outcomeByClassName);
  Object.keys(outcomeByClassName).forEach((className) => {
    const outcomes = outcomeByClassName[className];
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress-bar-container");

    const classNameElement = document.createElement("span");
    classNameElement.textContent = className;
    progressBarContainer.appendChild(classNameElement);

    Object.keys(outcomes).forEach((outcome) => {
      const outcomeCount = outcomes[outcome];
      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");

      const progressBarInner = document.createElement("div");
      progressBarInner.classList.add("progress-bar-inner");
      progressBarInner.style.width = `${(outcomeCount / sqlData.data.length) * 100}%`;

      const outcomeLabel = document.createElement("span");
      outcomeLabel.classList.add("outcome-label");
      outcomeLabel.textContent = `${outcome}: ${outcomeCount}`;

      progressBar.appendChild(progressBarInner);
      progressBar.appendChild(outcomeLabel);
      progressBarContainer.appendChild(progressBar);
    });
    document.body.appendChild(progressBarContainer);
  });
}

function drawPie(){
  countOutcomes();
}

function showTable(){
  loadProgress();
}

const myButton = document.getElementById('Load');
myButton.addEventListener('click', loadData);

const outcomeButton = document.getElementById("CircularProgress");
outcomeButton.addEventListener('click',drawPie);

const LoadButton =  document.getElementById("LoadProgress");
LoadButton.addEventListener('click',loadFailedCases);