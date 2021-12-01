$(document).ready(function() {
    loadTable()
});

function loadTable(type = null) {
    $.ajax({
        url: 'data/index.json',
        type: "Get",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            let dataJson = JSON.parse(JSON.stringify(data));
            let allData = dataJson.allData
            filterRows(type, allData)

            let dataFilterAM = allData.filter((item) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'].includes(item.name.charAt(0).toLowerCase()))
            let dataFilterNZ = allData.filter((item) => ['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(item.name.charAt(0).toLowerCase()))

            $('.AMCount').html(dataFilterAM.length)
            $('.NZCount').html(dataFilterNZ.length)
        },
        error: function() {
            alert("json not found");
        },
        statusCode: {
            404: function() {
                alert('There was a problem with the server.  Try again soon!');
            }
        }
    });
}

function filterRows(type, allData) {
    let data = []
    if (type == 1) {
        data = allData.filter((item) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'].includes(item.name.charAt(0).toLowerCase()))

    } else if (type == 2) {
        data = allData.filter((item) => ['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(item.name.charAt(0).toLowerCase()))
    } else {
        data = allData
    }
    $('table').html('')
    constructTable(data, $('table'))
}

function constructTable(list, selector) {

    // Getting the all column names
    var cols = generateHeaders(list, selector);

    // Traversing the JSON data
    for (var i = 0; i < list.length; i++) {
        var row = $('<tr/>');
        for (var colIndex = 0; colIndex < cols.length; colIndex++) {
            var val = list[i][cols[colIndex]];
            // If there is any key, which is matching
            // with the column name
            if (val == null) {
                val = "";
            }
            let searchVal = $('#search').val().toLowerCase()
            if (colIndex == 0) {
                let searchString = val.toLowerCase()
                let tempSearch = val.toLowerCase()

                if (searchVal !== '' && searchVal !== undefined && searchString.includes(searchVal)) {
                    row.append($("<td class='active' />").html(val));
                } else {
                    row.append($('<td />').html(val));
                }
            } else {
                row.append($('<td />').html(val));
            }
        }

        // Adding each row to the table
        $(selector).append(row);
    }
}

function generateHeaders(list, selector) {
    let columns = [];
    let header = $('<tr/>');

    for (let i = 0; i < list.length; i++) {
        let row = list[i];
        for (let k in row) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k)
                // Creating the header
                const text = k;
                const result = text.replace(/([A-Z])/g, " $1");
                const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                const anchoreTag = $('<a/>').html(finalResult)
                anchoreTag.attr('href', '#')
                let newHeaderCell = $('<th/>')
                header.append(newHeaderCell.html(anchoreTag));
                anchoreTag.click(function() {
                    sortTable(columns.indexOf(k))
                })
            }
        }
    }

    // Appending the header to the table
    $(selector).append(header);
    return columns;
}

function sortTable(n) {
    $('.asc').removeClass('asc')
    if ($('.desc').length > 0) {
        loadTable()
    }
    $('.desc').removeClass('desc')
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        let columnName = rows[0].getElementsByTagName("TH")[n];
        if (dir == "asc") {
            columnName.classList.remove("desc");
            columnName.classList.add("asc");
        } else if (dir == "desc") {
            columnName.classList.remove("asc");
            columnName.classList.add("desc");
        }

        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}