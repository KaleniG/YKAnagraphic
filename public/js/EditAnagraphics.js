let currentFilter = "";
let currentSortField = null;
let currentSortOrder = "none";

$(document).on("click", ".remove-button", function () {
  const row = $(this).closest("tr");
  const id = row.attr("anagraphic-id");
  removeOperation(id, row);
});

function updateOperation(element, row, updateInfo) {
  $.ajax({
    url: "index.php",
    method: "POST",
    data: updateInfo,
    dataType: "json",
    success: (res) => {
      if (res.status === "ok") {
        Object.assign(element, {
          ...updateInfo,
          enabled: updateInfo.enabled === "yes" ? "t" : "f"
        });

        row.addClass("saved");
        setTimeout(() => row.removeClass("saved"), 1200);
      } else {
        alert("Failed to update record");
      }
    },
    error: (xhr, status, error) => console.error(error)
  });
}

function removeOperation(id, row) {
  $.ajax({
    url: "index.php",
    method: "POST",
    data: { operation: "remove", id },
    dataType: "json",
    success: (res) => {
      if (res.status === "ok") {
        row.fadeOut(400, () => row.remove());
        const index = anagraphicsData.findIndex(el => el.id == id);
        if (index !== -1) anagraphicsData.splice(index, 1);
      } else {
        alert("Failed to remove record");
      }
    },
    error: (xhr, status, error) => console.error(error)
  });
}

function addRow(element, index) {

  if (currentFilter === "enabled" && element.enabled === "f") return;
  if (currentFilter === "disabled" && element.enabled === "t") return;

  const row = $("<tr>", { "anagraphic-id": element.id });
  const mkInput = (type, val, onChange, disabled) =>
    $("<input>", {
      type,
      value: val,
      class: "edit",
      disabled,
      autocomplete: false,
      autocorrect: false,
      spellcheck: false
    }).on("change", onChange);

  const gatherUpdate = () => {
    const enabledChecked = enabledInput.prop("checked");
    const data = {
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
    if (enabledChecked)
      data.enabled = "yes"
    return data;
  };

  const onChange = () => updateOperation(element, row, gatherUpdate());
  const nameInput = mkInput("text", element.name, onChange, true);
  const surnameInput = mkInput("text", element.surname, onChange, true);
  const emailInput = mkInput("email", element.email, onChange, element.enabled !== "t");
  const phoneNumberInput = mkInput("number", element.phone_number, onChange, element.enabled !== "t");
  const cityNameInput = mkInput("text", element.city_name, onChange, element.enabled !== "t");
  const wayNameInput = mkInput("text", element.way_name, onChange, element.enabled !== "t");
  const wayNumberInput = mkInput("text", element.way_number, onChange, element.enabled !== "t");

  const enabledInput = $("<input>", {
    type: "checkbox",
    class: "edit",
    checked: element.enabled === "t"
  });

  enabledInput.on("change", function () {
    const isEnabled = $(this).prop("checked");
    const updateInfo = gatherUpdate();
    updateOperation(element, row, updateInfo);

    [emailInput, phoneNumberInput, cityNameInput, wayNameInput, wayNumberInput]
      .forEach(input => input.prop("disabled", !isEnabled));

    const td = row.find("td:last");
    td.find(".remove-button").remove();
    if (!isEnabled) {
      const removeButton = $("<button>", {
        type: "button",
        text: "Remove",
        class: "remove-button edit",
        "data-id": element.id
      }).hide().fadeIn(400);
      td.append(removeButton);
    }

    if (currentFilter === "enabled" && !isEnabled)
      row.fadeOut(400, () => row.remove());
    else if (currentFilter === "disabled" && isEnabled)
      row.fadeOut(400, () => row.remove());
  });

  row.append($("<td>").append(nameInput))
    .append($("<td>").append(surnameInput))
    .append($("<td>").append(emailInput))
    .append($("<td>").append(phoneNumberInput))
    .append($("<td>").append(cityNameInput))
    .append($("<td>").append(wayNameInput))
    .append($("<td>").append(wayNumberInput))
    .append($("<td>").append(enabledInput))
    .append($("<td>"));

  if (element.enabled !== "t") {
    row.find("td:last").append(
      $("<button>", {
        type: "button",
        text: "Remove",
        class: "remove-button edit",
        "data-id": element.id
      })
    );
  }

  row.hide();
  $("tbody tr:last").after(row);
  row.delay(index * 100).fadeIn(300);
}

function handlePopulate() {
  $("tbody [anagraphic-id]").remove();

  let data = [...anagraphicsData];

  if (currentSortField && currentSortOrder !== "none") {
    data.sort((a, b) => {
      const fa = (a[currentSortField] + "").toLowerCase();
      const fb = (b[currentSortField] + "").toLowerCase();
      return currentSortOrder === "asc" ? fa.localeCompare(fb) : fb.localeCompare(fa);
    });
  }

  data.forEach((el, i) => addRow(el, i));
}

function handleSort() {
  $("th[data-field]").on("click", function () {
    const th = $(this);
    const field = th.data("field");
    let order = th.data("order");

    order = order === "none" ? "asc" : order === "asc" ? "desc" : "none";

    $("th[data-field]").not(th)
      .data("order", "none")
      .each(function () {
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
  $("#new_row button").on("click", () => {
    const dataToSend = {
      operation: "add",
      name: $("#new_row [name='name']").val(),
      surname: $("#new_row [name='surname']").val(),
      email: $("#new_row [name='email']").val(),
      phone_number: $("#new_row [name='phone_number']").val(),
      city_name: $("#new_row [name='city_name']").val(),
      way_name: $("#new_row [name='way_name']").val(),
      way_number: $("#new_row [name='way_number']").val(),
      enabled: $("#new_row [name='enabled']").prop("checked") ? "yes" : "no"
    };

    dataToSend.name = dataToSend.name.charAt(0).toUpperCase() + dataToSend.name.slice(1);
    dataToSend.surname = dataToSend.surname.charAt(0).toUpperCase() + dataToSend.surname.slice(1);

    dataToSend.city_name = dataToSend.city_name.charAt(0).toUpperCase() + dataToSend.city_name.slice(1);
    dataToSend.way_name = dataToSend.way_name.charAt(0).toUpperCase() + dataToSend.way_name.slice(1);

    const duplicateExists = anagraphicsData.some(anagraphic =>
      anagraphic.name === dataToSend.name && anagraphic.surname === dataToSend.surname
    );

    if (duplicateExists) {
      alert("Trying to add an already existing record");
      return;
    }

    $.ajax({
      url: "index.php",
      method: "POST",
      data: dataToSend,
      dataType: "json",
      success: (res) => {
        if (res.status === "ok") {
          const element = { ...dataToSend, id: res.id, enabled: dataToSend.enabled === "yes" ? "t" : "f" };
          anagraphicsData.push(element);
          handlePopulate();
          $("#new_row input[type!='checkbox']").val('');
          $("#new_row [name='enabled']").prop('checked', false);
        } else {
          alert("Failed to add record");
        }
      },
      error: (xhr, status, error) => console.error('AJAX error:', error)
    });
  });
}

$(document).ready(() => {
  handleSort();
  handleFilterSelect();
  handlePopulate();
  handleAddSection();
});