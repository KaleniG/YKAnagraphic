let currentFilter = ""; // "", "enabled", "disabled"
let currentSortField = null;
let currentSortOrder = "none";

function addRow(element, index, filter) {
  if (currentFilter == "enabled" && element.enabled == "f") return;
  if (currentFilter == "disabled" && element.enabled == "t") return;

  const row = $("<tr>", { "anagraphic-id": element.id });

  const updateGatherInfo = () => {
    const updateInfo = {
      operation: "update",
      id: element.id,
      name: nameInput.val(),
      surname: surnameInput.val(),
      email: emailInput.val(),
      phone_number: phoneNumberInput.val(),
      city_name: cityNameInput.val(),
      way_name: wayNameInput.val(),
      way_number: wayNumberInput.val()
    };
    if (enabledInput.prop("checked"))
      updateInfo.enabled = "yes";

    return updateInfo;
  };

  const updateOperation = () => {
    const updateInfo = updateGatherInfo();

    $.ajax({
      url: "index.php",
      method: "POST",
      data: updateInfo,
      dataType: "json",
      success: (res) => {
        if (res.status === "ok") {
          // Update local data object
          Object.assign(element, {
            name: updateInfo.name,
            surname: updateInfo.surname,
            email: updateInfo.email,
            phone_number: updateInfo.phone_number,
            city_name: updateInfo.city_name,
            way_name: updateInfo.way_name,
            way_number: updateInfo.way_number,
            enabled: updateInfo.enabled === "yes" ? "t" : "f"
          });

          // Optional: visual feedback
          row.addClass("saved");
          setTimeout(() => row.removeClass("saved"), 1200);

          // Enable/disable inputs according to "enabled" state
          const isEnabled = element.enabled === "t";
          [emailInput, phoneNumberInput, cityNameInput, wayNameInput, wayNumberInput].forEach(input => {
            input.prop("disabled", !isEnabled);
          });

          // Show/hide remove button dynamically
          const td = row.find("td:last");
          td.find(".remove-button").remove();
          if (!isEnabled) td.append(removeButton.hide().fadeIn(400));
        } else {
          alert("Failed to update record");
        }
      },
      error: (xhr, status, error) => console.error(error)
    });
  };

  const removeOperation = () => {
    $.ajax({
      url: "index.php",
      method: "POST",
      data: { operation: "remove", id: element.id },
      dataType: "json",
      success: (res) => {
        if (res.status === "ok") {
          if (res.status === "ok") {
            row.fadeOut(400, () => row.remove());
            delete anagraphicsData[index];
          }
        }
        else alert("Failed to remove record");
      },
      error: (xhr, status, error) => console.error(error)
    });
  };

  const nameInput = $("<input>", { type: "text", value: element.name, class: "edit", disabled: true });
  const surnameInput = $("<input>", { type: "text", value: element.surname, class: "edit", disabled: true });
  const emailInput = $("<input>", { type: "email", value: element.email, class: "edit", disabled: (element.enabled == "t") ? true : false }).on("change", updateOperation);
  const phoneNumberInput = $("<input>", { type: "number", value: element.phone_number, class: "edit", disabled: (element.enabled == "t") ? true : false }).on("change", updateOperation);
  const cityNameInput = $("<input>", { type: "text", value: element.city_name, class: "edit", disabled: (element.enabled == "t") ? true : false }).on("change", updateOperation);
  const wayNameInput = $("<input>", { type: "text", value: element.way_name, class: "edit", disabled: (element.enabled == "t") ? true : false }).on("change", updateOperation);
  const wayNumberInput = $("<input>", { type: "text", value: element.way_number, class: "edit", disabled: (element.enabled == "t") ? true : false }).on("change", updateOperation);
  const enabledInput = $("<input>", { type: "checkbox", class: "edit", checked: (element.enabled == "t") ? true : false });

  const removeButton = $("<button>", {
    type: "button",
    text: "Remove",
    class: "remove-button edit",
    click: removeOperation
  });

  enabledInput.on("change", function () {
    updateOperation();

    if (filter == "enabled" && !$(this).prop("checked")) {
      row.fadeOut(400, () => row.remove());
      return;
    }
    if (filter == "disabled" && $(this).prop("checked")) {
      row.fadeOut(400, () => row.remove());
      return;
    }
  });

  row.append($("<td>").append(nameInput));
  row.append($("<td>").append(surnameInput));
  row.append($("<td>").append(emailInput));
  row.append($("<td>").append(phoneNumberInput));
  row.append($("<td>").append(cityNameInput));
  row.append($("<td>").append(wayNameInput));
  row.append($("<td>").append(wayNumberInput));
  row.append($("<td>").append(enabledInput));
  row.append($("<td>"));

  if (!(element.enabled == "t")) row.find("td:last").append(removeButton);

  row.css("display", "none");
  $("tbody tr:last").after(row);
  row.delay(index * 100).fadeIn(300);
}

function handlePopulate() {
  $("tbody [anagraphic-id]").remove();

  let data = [...anagraphicsData];

  // Apply sorting
  if (currentSortField && currentSortOrder !== "none") {
    data.sort((a, b) => {
      let fa = a[currentSortField];
      let fb = b[currentSortField];

      // Alphabetical sort for others (case-insensitive)
      fa = (fa + "").toLowerCase();
      fb = (fb + "").toLowerCase();
      return currentSortOrder === "asc" ? fa.localeCompare(fb) : fb.localeCompare(fa);
    });
  }

  data.forEach((el, index) => addRow(el, index));
}

function handleSort() {
  $("th[data-field]").on("click", function () {
    const th = $(this);
    const field = th.data("field");
    let order = th.data("order");

    if (order === "none") order = "asc";
    else if (order === "asc") order = "desc";
    else order = "none";

    $("th[data-field]").not(th).data("order", "none").each(function () {
      $(this).text($(this).text().replace(/ ▲| ▼/, ""));
    });

    th.data("order", order);
    currentSortField = field;
    currentSortOrder = order;

    const arrow = order === "asc" ? " ▲" : order === "desc" ? " ▼" : "";
    th.text(th.text().replace(/ ▲| ▼/, "") + arrow);

    handlePopulate();
  });
}

function handleFilterSelect() {
  $("select").on("change", function () {
    currentFilter = $(this).val();
    handlePopulate();
  });
}

function handleAddSection() {
  $("#new_row button").on("click", (e) => {

    const dataToSend = {
      operation: "add",
      name: $("#new_row [name='name']").val(),
      surname: $("#new_row [name='surname']").val(),
      email: $("#new_row [name='email']").val(),
      phone_number: $("#new_row [name='phone_number']").val(),
      city_name: $("#new_row [name='city_name']").val(),
      way_name: $("#new_row [name='way_name']").val(),
      way_number: $("#new_row [name='way_number']").val()
    };

    if ($("#new_row [name='enabled']").prop("checked")) {
      dataToSend.enabled = "yes";
    }

    $.ajax({
      url: "index.php",
      method: 'POST',
      data: dataToSend,
      dataType: 'json',
      success: (res) => {
        if (res.status === "ok") {
          const element = {
            id: res.id,
            name: dataToSend.name,
            surname: dataToSend.surname,
            email: dataToSend.email,
            phone_number: dataToSend.phone_number,
            city_name: dataToSend.city_name,
            way_name: dataToSend.way_name,
            way_number: dataToSend.way_number,
          };

          if (dataToSend.enabled)
            element.enabled = dataToSend.enabled ? "t" : "f"

          anagraphicsData.push(element);
          handlePopulate(anagraphicsData);

          $("#new_row input[type!='checkbox']").val('');
          $("#new_row [name='enabled']").prop('checked', false);
        } else {
          alert("Failed to add record");
        }
      },
      error: (xhr, status, error) => {
        console.error('AJAX error:', error);
      }
    });
  });
}

$(document).ready(() => {
  handleSort();
  handleFilterSelect();
  handlePopulate();
  handleAddSection();
});